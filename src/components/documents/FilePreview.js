import React, { useState, useEffect } from 'react';
import { FiFileText, FiImage, FiFile } from 'react-icons/fi';
import styles from './FilePreview.module.css';

const FilePreview = ({ file }) => {
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState('');
  
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    
    // Clean up function to revoke object URL when component unmounts
    let objectUrl = null;
    
    // Determine file type
    if (typeof file === 'string') {
      // If file is already a URL or data URL, use it directly
      setPreview(file);
      if (file.startsWith('data:image/')) {
        setFileType('image');
      } else if (file.startsWith('data:application/pdf')) {
        setFileType('pdf');
      } else if (file.match(/\.(jpe?g|png|gif)$/i)) {
        setFileType('image');
      } else if (file.match(/\.(pdf)$/i)) {
        setFileType('pdf');
      } else {
        setFileType('other');
      }
    } else if (file.type.startsWith('image/')) {
      setFileType('image');
      
      // Generate image preview
      objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else if (file.type === 'application/pdf') {
      setFileType('pdf');
      
      // Generate PDF preview URL
      objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setFileType('other');
      setPreview(null);
    }
    
    // Clean up the URL when component unmounts
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);
  
  // Get icon based on file type
  const getFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <FiImage size={24} />;
      case 'pdf':
        return <FiFileText size={24} />;
      default:
        return <FiFile size={24} />;
    }
  };
  
  if (!file) {
    return null;
  }
  
  const fileName = typeof file === 'string' 
    ? file.split('/').pop().split('?')[0] // Extract filename from URL
    : file.name;
  
  const fileSize = typeof file !== 'string' 
    ? formatFileSize(file.size)
    : '';
  
  return (
    <div className={styles.previewContainer}>
      <div className={styles.fileInfo}>
        <div className={styles.fileTypeIcon}>
          {getFileIcon()}
        </div>
        <div className={styles.fileDetails}>
          <div className={styles.fileName}>{fileName}</div>
          {fileSize && <div className={styles.fileSize}>{fileSize}</div>}
        </div>
      </div>
      
      {preview && (
        <div className={styles.previewContent}>
          {fileType === 'image' ? (
            <img 
              src={preview} 
              alt="File preview" 
              className={styles.imagePreview} 
            />
          ) : fileType === 'pdf' ? (
            <div className={styles.pdfPreview}>
              <object
                data={preview}
                type="application/pdf"
                width="100%"
                height="300"
                className={styles.pdfFrame}
              >
                <div className={styles.pdfMessage}>
                  PDF Preview Available
                </div>
              </object>
            </div>
          ) : (
            <div className={styles.noPreview}>
              No preview available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default FilePreview;