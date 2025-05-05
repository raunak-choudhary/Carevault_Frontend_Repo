import React, { useState, useRef } from 'react';
import { FiSend, FiPaperclip, FiX } from 'react-icons/fi';
import styles from './ChatInput.module.css';

const ChatInput = ({
  onSendMessage,
  disabled,
  placeholder = 'Type a message...',
}) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Remove attached file
  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Don't submit if disabled or no content
    if (disabled || (!message.trim() && !file)) {
      return;
    }

    // Call parent handler
    onSendMessage(message, file);

    // Reset form
    setMessage('');
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get file name for display
  const getFileName = (file) => {
    if (!file) return '';

    // If file is a string (URL)
    if (typeof file === 'string') {
      return file.split('/').pop();
    }

    // If file is an object
    return file.name || 'File';
  };

  return (
    <form className={styles.inputContainer} onSubmit={handleSubmit}>
      {/* File attachment preview */}
      {file && (
        <div className={styles.attachmentPreview}>
          <div className={styles.attachmentInfo}>
            <span className={styles.attachmentName}>{getFileName(file)}</span>
            <span className={styles.attachmentSize}>
              {file.size ? `${Math.round(file.size / 1024)} KB` : ''}
            </span>
          </div>
          <button
            type="button"
            className={styles.removeAttachment}
            onClick={removeFile}
            aria-label="Remove attachment"
          >
            <FiX />
          </button>
        </div>
      )}

      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.messageInput}
          aria-label="Message input"
        />

        <div className={styles.inputActions}>
          <button
            type="button"
            className={styles.attachButton}
            onClick={openFileDialog}
            disabled={disabled}
            aria-label="Attach file"
          >
            <FiPaperclip />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className={styles.fileInput}
            accept="image/*,application/pdf,.doc,.docx"
            aria-label="File input"
          />

          <button
            type="submit"
            className={styles.sendButton}
            disabled={disabled || (!message.trim() && !file)}
            aria-label="Send message"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
