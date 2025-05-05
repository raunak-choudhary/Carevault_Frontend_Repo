/**
 * A utility class to handle browser notifications for medication reminders
 */
class NotificationSystem {
  constructor() {
    this.hasPermission = false;
    this.checkPermission();
    this.activeNotifications = new Map();
  }

  /**
   * Check if browser notifications are supported and if permission is granted
   */
  checkPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
      return true;
    }

    return false;
  }

  /**
   * Request permission to show notifications
   * @returns {Promise} Resolves with a boolean indicating if permission was granted
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      return this.hasPermission;
    }

    return false;
  }

  /**
   * Send a notification
   * @param {Object} options - Notification options
   * @param {string} options.title - Notification title
   * @param {string} options.body - Notification body
   * @param {string} options.icon - URL to an icon
   * @param {Function} options.onClick - Function to call when notification is clicked
   * @param {string} options.id - Unique identifier for the notification
   * @param {Object} options.actions - Actions for the notification
   * @param {boolean} options.requireInteraction - Whether the notification should remain until the user interacts with it
   * @returns {Notification|null} The notification object or null
   */
  sendNotification({
    title,
    body,
    icon,
    onClick,
    id,
    actions,
    requireInteraction = false,
  }) {
    if (!this.hasPermission && !this.checkPermission()) {
      console.warn('Notification permission not granted');
      return null;
    }

    try {
      // Close existing notification with the same ID if it exists
      if (id && this.activeNotifications.has(id)) {
        this.closeNotification(id);
      }

      const notification = new Notification(title, {
        body,
        icon,
        tag: id,
        requireInteraction,
        actions,
      });

      // Store the notification if it has an ID
      if (id) {
        this.activeNotifications.set(id, notification);
      }

      // Set up click handler
      if (onClick) {
        notification.onclick = () => {
          onClick();
          notification.close();
        };
      }

      // Set up close handler to clean up the notifications map
      notification.onclose = () => {
        if (id) {
          this.activeNotifications.delete(id);
        }
      };

      // Play sound for the notification if specified
      this.playSound();

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }

  /**
   * Play a notification sound
   * @param {string} soundType - Type of sound to play (default, chime, bell, gentle, urgent)
   */
  playSound(soundType = 'default') {
    try {
      // Use HTML5 Audio API to play the notification sound
      const audio = new Audio();

      // In a real implementation, these would be paths to actual sound files
      switch (soundType) {
        case 'chime':
          audio.src = '/sounds/chime.mp3';
          break;
        case 'bell':
          audio.src = '/sounds/bell.mp3';
          break;
        case 'gentle':
          audio.src = '/sounds/gentle.mp3';
          break;
        case 'urgent':
          audio.src = '/sounds/urgent.mp3';
          break;
        default:
          audio.src = '/sounds/default.mp3';
          break;
      }

      audio.play().catch((error) => {
        // Autoplay might be blocked by the browser
        console.warn('Could not play notification sound:', error);
      });
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }

  /**
   * Vibrate the device if supported
   * @param {Array|number} pattern - Vibration pattern or duration
   */
  vibrate(pattern = [200, 100, 200]) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.warn('Vibration failed:', error);
      }
    }
  }

  /**
   * Close a specific notification by ID
   * @param {string} id - ID of the notification to close
   */
  closeNotification(id) {
    if (this.activeNotifications.has(id)) {
      const notification = this.activeNotifications.get(id);
      notification.close();
      this.activeNotifications.delete(id);
    }
  }

  /**
   * Close all active notifications
   */
  closeAllNotifications() {
    this.activeNotifications.forEach((notification) => {
      notification.close();
    });
    this.activeNotifications.clear();
  }

  /**
   * Schedule a notification for a future time
   * @param {Object} options - Notification options (same as sendNotification)
   * @param {Date|number} scheduledTime - When to show the notification (Date object or timestamp)
   * @returns {string} ID of the scheduled notification
   */
  scheduleNotification(options, scheduledTime) {
    const now = new Date().getTime();
    const scheduleTime =
      scheduledTime instanceof Date ? scheduledTime.getTime() : scheduledTime;

    const delay = Math.max(0, scheduleTime - now);
    const notificationId =
      options.id ||
      `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store options with ID for reference
    const notificationOptions = { ...options, id: notificationId };

    // Set a timeout to send the notification at the scheduled time
    setTimeout(() => {
      this.sendNotification(notificationOptions);
    }, delay);

    return notificationId;
  }
}

// Create a singleton instance
const notificationSystem = new NotificationSystem();

export default notificationSystem;
