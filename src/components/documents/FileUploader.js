import React, { useState, useRef } from 'react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import FilePreview from './FilePreview';
import styles from './FileUploader.module.css';

const FileUploader = ({ onFileSelect, acceptedFileTypes }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Define accepted file types if not provided
  const fileTypes = acceptedFileTypes || 'image/*, application/pdf';

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  // Handle file selection from drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  // Handle file selection from file input
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  // Validate and set the selected file
  const validateAndSetFile = (file) => {
    // Reset error state
    setError('');

    // Check file type
    const isValidType = checkFileType(file);
    if (!isValidType) {
      setError('Invalid file type. Please upload an image or PDF file.');
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }

    // Set file and call parent callback
    setFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  // Check if file type is allowed
  const checkFileType = (file) => {
    // If no specific types are required, accept all
    if (!fileTypes) return true;

    // Convert fileTypes string to array and check each type
    const types = fileTypes.split(',').map((type) => type.trim());

    return types.some((type) => {
      // Handle wildcard types (e.g., "image/*")
      if (type.endsWith('/*')) {
        const category = type.slice(0, type.indexOf('/*'));
        return file.type.startsWith(category);
      }

      // Exact match
      return file.type === type;
    });
  };

  // Trigger file input click
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clear selected file
  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  return (
    <div className={styles.fileUploaderContainer}>
      {file ? (
        <div className={styles.filePreviewContainer}>
          <FilePreview file={file} />
          <button
            type="button"
            className={styles.clearButton}
            onClick={clearFile}
          >
            <FiX /> Remove File
          </button>
        </div>
      ) : (
        <div
          className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            type="file"
            className={styles.fileInput}
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={fileTypes}
          />

          <div className={styles.uploadIcon}>
            {isDragging ? <FiFile size={48} /> : <FiUpload size={48} />}
          </div>

          <div className={styles.dropZoneText}>
            {isDragging ? (
              'Drop file here'
            ) : (
              <>
                <strong>Click to upload</strong> or drag and drop
                <div className={styles.dropZoneHint}>
                  Supported formats: Images, PDF
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default FileUploader;
