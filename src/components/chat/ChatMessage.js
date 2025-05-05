import React from 'react';
import { FiFile, FiFileText, FiImage } from 'react-icons/fi';
import styles from './ChatMessage.module.css';

const ChatMessage = ({ message, isLast }) => {
  const {
    sender,
    content,
    timestamp,
    attachment,
    isError,
    referencedDocuments,
  } = message;

  // Format timestamp for display
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get file icon based on file type
  const getFileIcon = (file) => {
    if (!file) return null;

    if (typeof file === 'string') {
      // If file is a URL
      if (file.match(/\.(jpe?g|png|gif|svg)$/i)) {
        return <FiImage />;
      } else if (file.match(/\.(pdf)$/i)) {
        return <FiFileText />;
      } else {
        return <FiFile />;
      }
    }

    // If file is an object
    if (file.type?.startsWith('image/')) {
      return <FiImage />;
    } else if (file.type === 'application/pdf') {
      return <FiFileText />;
    } else {
      return <FiFile />;
    }
  };

  return (
    <div
      className={`${styles.message} ${
        sender === 'user' ? styles.userMessage : styles.aiMessage
      } ${isError ? styles.errorMessage : ''}`}
      data-testid={`message-${sender}`}
    >
      <div className={styles.messageContent}>
        <p>{content}</p>

        {/* Render file attachment if any */}
        {attachment && (
          <div className={styles.attachment}>
            {getFileIcon(attachment)}
            <span className={styles.attachmentName}>
              {typeof attachment === 'string'
                ? attachment.split('/').pop()
                : attachment.name || 'Attached file'}
            </span>
          </div>
        )}

        {/* Render referenced documents if any */}
        {referencedDocuments && referencedDocuments.length > 0 && (
          <div className={styles.referencedDocuments}>
            <span className={styles.referencedTitle}>
              Referenced documents:
            </span>
            <ul>
              {referencedDocuments.map((doc, index) => (
                <li key={index} className={styles.referencedItem}>
                  {getFileIcon(doc)}
                  <span>{doc.title || 'Untitled document'}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.messageTime}>{formatTime(timestamp)}</div>
    </div>
  );
};

export default ChatMessage;
