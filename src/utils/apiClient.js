import axios from 'axios';

const API_BASE_URL = 'http://localhost:1999/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// State for Refresh Logic
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Response Interceptor ---
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (
      status === 401 &&
      originalRequest.url !==
        `<span class="math-inline">\{API\_BASE\_URL\}</span>{REFRESH_TOKEN_ENDPOINT}` &&
      !originalRequest._retry &&
      storedRefreshToken
    ) {
      if (isRefreshing) {
        // Queue the request if refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Start refreshing
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `<span class="math-inline">\{API\_BASE\_URL\}</span>{REFRESH_TOKEN_ENDPOINT}`,
          {
            refreshToken: storedRefreshToken,
          },
        );
        const { token: newToken, refreshToken: newRefreshToken } =
          refreshResponse.data;

        localStorage.setItem('token', newToken);
        if (newRefreshToken)
          localStorage.setItem('refreshToken', newRefreshToken);

        apiClient.defaults.headers.common['Authorization'] =
          'Bearer ' + newToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;

        processQueue(null, newToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed, logging out:', refreshError);
        processQueue(refreshError, null);

        // --- Minimal Logout Logic ---
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Clear other critical storage if needed
        delete apiClient.defaults.headers.common['Authorization'];
        // Redirect (or emit event for UI to handle)
        window.location.href = '/login?sessionExpired=true';
        // --- End Minimal Logout Logic ---

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else if (status === 401 && !storedRefreshToken) {
      console.warn('Received 401 but no refresh token found. Logging out.');
      // --- Minimal Logout Logic ---
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      delete apiClient.defaults.headers.common['Authorization'];
      window.location.href = '/login?sessionExpired=true';
      // --- End Minimal Logout Logic ---
      return Promise.reject(error); // Reject the original error
    }

    return Promise.reject(error);
  },
);

const handleApiError = (error) => {
  // ... (error handling logic as before)
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      // Check if it's 401
      // Message can indicate session issue, as refresh might have failed
      return 'Your session may have expired. Please try logging in again.';
    }
    return (
      error.response?.data?.message || error.message || 'An API error occurred'
    );
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

export { apiClient, handleApiError };
