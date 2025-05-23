import { apiClient, handleApiError } from '../utils/apiClient';

// This service would normally make API calls to a backend server with LLM integration
// For now, we'll simulate responses

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Store chat history in localStorage
const getChatHistory = async () => {
  const response = await apiClient.get('/chat/');
  const data = response.data;

  console.log(data);

  const history = data?.data?.messages || [];

  console.log(history);

  return history;
};

const saveChatHistory = (messages) => {
  localStorage.setItem('chatHistory', JSON.stringify(messages));
};

// Generate a response based on user input (simulated)
const generateResponse = async (message, file = null, documents = []) => {
  // Simulate API call delay

  // In a real app, this would call a backend API with LLM integration
  // Future phases will implement the actual AI integration
  const lowerMsg = message.toLowerCase();

  const response = await apiClient.post('/chat/message', {
    message: lowerMsg,
    document_ids: documents,
  });

  const data = response.data;
  console.log(data);

  const resp_message =
    data?.data?.message ||
    'I was unable to process your request. Please try again later.';
  const timestamp = data?.data?.created_at || new Date().toISOString();

  return {
    content: resp_message,
    timestamp: timestamp,
    referencedDocuments: [],
  };

  // // Handle file attachments
  // if (file) {
  //   return {
  //     content: `I've received your ${getFileType(file)} file. In a fully implemented system, I would analyze this document and provide insights or answer questions about it.`,
  //     timestamp: new Date().toISOString(),
  //     referencedDocuments: [],
  //   };
  // }

  // // Handle different types of queries
  // if (
  //   lowerMsg.includes('medication') ||
  //   lowerMsg.includes('medicine') ||
  //   lowerMsg.includes('prescription')
  // ) {
  //   return {
  //     content:
  //       "I don't see any medications in your records yet. You can upload your prescription documents or add medications manually in the Medications section.",
  //     timestamp: new Date().toISOString(),
  //     referencedDocuments: [],
  //   };
  // }

  // if (
  //   lowerMsg.includes('appointment') ||
  //   lowerMsg.includes('doctor') ||
  //   lowerMsg.includes('visit')
  // ) {
  //   return {
  //     content:
  //       'Your next appointment is not scheduled yet. Would you like to use the appointment scheduler to find a healthcare provider?',
  //     timestamp: new Date().toISOString(),
  //     referencedDocuments: [],
  //   };
  // }

  // if (
  //   lowerMsg.includes('health') ||
  //   lowerMsg.includes('condition') ||
  //   lowerMsg.includes('symptom')
  // ) {
  //   return {
  //     content:
  //       "Based on the documents you've uploaded, I don't have enough information to provide health insights yet. Please upload your medical records through the Documents section.",
  //     timestamp: new Date().toISOString(),
  //     referencedDocuments: [],
  //   };
  // }

  // if (
  //   lowerMsg.includes('document') ||
  //   lowerMsg.includes('record') ||
  //   lowerMsg.includes('report')
  // ) {
  //   if (documents.length > 0) {
  //     return {
  //       content: `You have ${documents.length} document(s) in your CareVault. Your most recent document is "${documents[0].title}". Is there anything specific about your documents you'd like to know?`,
  //       timestamp: new Date().toISOString(),
  //       referencedDocuments: [documents[0]],
  //     };
  //   } else {
  //     return {
  //       content:
  //         "You haven't uploaded any documents yet. Would you like me to guide you through the document upload process?",
  //       timestamp: new Date().toISOString(),
  //       referencedDocuments: [],
  //     };
  //   }
  // }

  // if (
  //   lowerMsg.includes('hello') ||
  //   lowerMsg.includes('hi') ||
  //   lowerMsg.startsWith('hey')
  // ) {
  //   return {
  //     content: `Hello! I'm your CareVault assistant. How can I assist with your healthcare management today?`,
  //     timestamp: new Date().toISOString(),
  //     referencedDocuments: [],
  //   };
  // }

  // Default response
  return {
    content:
      "I'm here to help with your healthcare management. You can ask me about your documents, medications, appointments, or health insights. How can I assist you further?",
    timestamp: new Date().toISOString(),
    referencedDocuments: [],
  };
};

// Get file type based on mimetype or name
const getFileType = (file) => {
  if (!file) return 'unknown';

  if (typeof file === 'string') {
    // If file is a URL or string path
    if (file.match(/\.(jpe?g|png|gif|bmp|svg)$/i)) {
      return 'image';
    } else if (file.match(/\.(pdf)$/i)) {
      return 'PDF';
    } else if (file.match(/\.(doc|docx)$/i)) {
      return 'document';
    } else {
      return 'file';
    }
  }

  // If file is a File object
  if (file.type) {
    if (file.type.startsWith('image/')) {
      return 'image';
    } else if (file.type === 'application/pdf') {
      return 'PDF';
    } else if (
      file.type === 'application/msword' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return 'document';
    } else {
      return 'file';
    }
  }

  // Fallback to using filename
  const fileName = file.name || '';
  if (fileName.match(/\.(jpe?g|png|gif|bmp|svg)$/i)) {
    return 'image';
  } else if (fileName.match(/\.(pdf)$/i)) {
    return 'PDF';
  } else if (fileName.match(/\.(doc|docx)$/i)) {
    return 'document';
  } else {
    return 'file';
  }
};

// Process file attachment
const processFileAttachment = async (file) => {
  /**
   * 
   * 
   * const response = await axios({
    method: 'POST',
    url: 'http://your-api-base-url/api/chat/upload',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      // No need to set Content-Type, axios will set it automatically with boundary
    },
    data: formData
  });
   */

  console.log('Processing file attachment:', file);
  // const response = await apiClient.post('/chat/upload', file, {
  //   headers: {
  //     'Content-Type': file.type,
  //   },
  // });

  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/chat/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log('File upload response:', response);

  const data = response.data;
  console.log(data);

  const fileData = data?.data?.document || null;

  return {
    id: fileData.id,
    name: fileData.name,
    type: fileData.type,
    size: fileData.size,
    url: fileData.url,
    processed: fileData.processed,
  };
};

// Get suggested queries based on user context
const getSuggestedQueries = (documents = [], messages = []) => {
  // Provide contextual suggested queries
  const suggestions = [
    'What medications should I take today?',
    "When is my next doctor's appointment?",
    'Show me my recent lab results',
    'What does my blood pressure trend look like?',
  ];

  // Add document-specific queries if documents exist
  if (documents.length > 0) {
    suggestions.push(`What's in my ${documents[0].type || 'latest'} document?`);
    suggestions.push(`Summarize my recent medical documents`);
  }

  // Limit to 5 suggestions
  return suggestions.slice(0, 5);
};

export {
  getChatHistory,
  saveChatHistory,
  generateResponse,
  processFileAttachment,
  getSuggestedQueries,
  getFileType,
};
