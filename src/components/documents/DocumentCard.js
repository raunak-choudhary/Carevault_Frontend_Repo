import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiFileText,
  FiImage,
  FiFile,
  FiEdit,
  FiEye,
  FiDownload,
} from 'react-icons/fi';
import styles from './DocumentCard.module.css';

const DocumentCard = ({ document, onDelete, showActions = true }) => {
  // Get correct icon based on document type/mimetype
  const getDocumentIcon = () => {
    if (!document.type) return <FiFile />;

    const type = document.type.toLowerCase();

    if (
      type === 'prescription' ||
      type === 'lab-report' ||
      type === 'visit-summary'
    ) {
      return <FiFileText />;
    } else if (type === 'imaging') {
      return <FiImage />;
    }

    return <FiFile />;
  };

  // Format date for display
  const formatDate = (dateString) => {
    // Always prioritize document.date if available
    if (document.date) {
      // Parse the date string without timezone conversion
      const parts = document.date.split('T')[0].split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Months are 0-indexed in JS
        const day = parseInt(parts[2]);

        const date = new Date(year, month, day);
        return date.toLocaleDateString();
      }
    }

    // Fallback to createdAt if no date field exists
    if (dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }

    return 'Unknown date';
  };

  return (
    <Link to={`/documents/view/${document.id}`} className={styles.documentCard}>
      <div className={styles.documentIcon}>{getDocumentIcon()}</div>

      <div className={styles.documentContent}>
        <h3 className={styles.documentTitle}>{document.title}</h3>

        <div className={styles.documentMeta}>
          {document.type && (
            <span className={styles.documentType}>{document.type}</span>
          )}

          {document.provider && (
            <span className={styles.documentProvider}>{document.provider}</span>
          )}

          <span className={styles.documentDate}>
            {formatDate(document.createdAt)}
          </span>
        </div>

        {document.tags && document.tags.length > 0 && (
          <div className={styles.documentTags}>
            {document.tags.map((tag, index) => (
              <span key={index} className={styles.documentTag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {showActions && (
        <div
          className={styles.documentActions}
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            to={`/documents/view/${document.id}`}
            className={styles.actionButton}
            title="View Document"
          >
            <FiEye />
          </Link>

          <Link
            to={`/documents/view/${document.id}?edit=true`}
            className={styles.actionButton}
            title="Edit Document"
          >
            <FiEdit />
          </Link>

          <a
            href={document.fileUrl}
            download={document.title || 'document'}
            className={styles.actionButton}
            title="Download Document"
            onClick={(e) => e.stopPropagation()}
          >
            <FiDownload />
          </a>
        </div>
      )}
    </Link>
  );
};

export default DocumentCard;
