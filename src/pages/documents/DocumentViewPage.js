import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiDownload,
  FiFileText,
  FiImage,
  FiFile,
} from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  getDocumentById,
  updateDocument,
  deleteDocument,
} from '../../services/authService';
import styles from './DocumentViewPage.module.css';

const DocumentViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isEditing = queryParams.get('edit') === 'true';

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    type: '',
    provider: '',
    notes: '',
    date: '',
  });

  // Document type options
  const documentTypes = [
    { label: 'Prescription', value: 'prescription' },
    { label: 'Lab Report', value: 'lab-report' },
    { label: 'Imaging', value: 'imaging' },
    { label: 'Visit Summary', value: 'visit-summary' },
    { label: 'Insurance', value: 'insurance' },
    { label: 'Other', value: 'other' },
  ];

  // Fetch document data on component mount
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const doc = await getDocumentById(id);
        setDocument(doc);

        // Initialize edit form with document data
        setEditForm({
          title: doc.title || '',
          type: doc.type || '',
          provider: doc.provider || '',
          notes: doc.notes || '',
          date: doc.date || formatDateForInput(doc.createdAt),
        });
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Document not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  // Format date for date input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';

    // Parse the date string, keeping the date as-is without timezone conversion
    const parts = dateString.split('T')[0].split('-');
    if (parts.length !== 3) return '';

    return `${parts[0]}-${parts[1]}-${parts[2]}`;
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';

    // Parse the date string, preserving the exact date without timezone conversion
    const parts = dateString.split('T')[0].split('-');
    if (parts.length !== 3) return '';

    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Months are 0-indexed in JS
    const day = parseInt(parts[2]);

    const date = new Date(year, month, day);

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get document icon based on type
  const getDocumentIcon = () => {
    if (!document || !document.type) return <FiFile size={24} />;

    const type = document.type.toLowerCase();

    if (
      type === 'prescription' ||
      type === 'lab-report' ||
      type === 'visit-summary'
    ) {
      return <FiFileText size={24} />;
    } else if (type === 'imaging') {
      return <FiImage size={24} />;
    }

    return <FiFile size={24} />;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Update document
      const updatedDoc = await updateDocument(id, editForm);

      // Update local state
      setDocument(updatedDoc);

      // Exit edit mode
      navigate(`/documents/view/${id}`);
    } catch (err) {
      console.error('Error updating document:', err);
      setError('Failed to update document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle document deletion
  const handleDelete = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete this document? This action cannot be undone.',
      )
    ) {
      try {
        setLoading(true);
        await deleteDocument(id);

        // Redirect to documents list
        navigate('/documents');
      } catch (err) {
        console.error('Error deleting document:', err);
        setError('Failed to delete document. Please try again.');
        setLoading(false);
      }
    }
  };

  // Cancel editing
  const handleCancel = () => {
    navigate(`/documents/view/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/documents" className={styles.backButton}>
          <FiArrowLeft /> Back to Documents
        </Link>
      </div>
    );
  }

  if (!document) {
    return (
      <div className={styles.errorContainer}>
        <h2>Document Not Found</h2>
        <p>The requested document could not be found.</p>
        <Link to="/documents" className={styles.backButton}>
          <FiArrowLeft /> Back to Documents
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.documentViewPage}>
      <div className={styles.pageHeader}>
        <Link to="/documents" className={styles.backButton}>
          <FiArrowLeft /> Back to Documents
        </Link>

        {!isEditing && (
          <div className={styles.actionButtons}>
            <Link
              to={`/documents/view/${id}?edit=true`}
              className={styles.editButton}
            >
              <FiEdit /> Edit
            </Link>
            <button className={styles.deleteButton} onClick={handleDelete}>
              <FiTrash2 /> Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className={styles.documentEdit}>
          <h1>Edit Document</h1>

          <form onSubmit={handleSubmit} className={styles.editForm}>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleInputChange}
                required
                className={styles.inputField}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Document Type</label>
                <select
                  name="type"
                  value={editForm.type}
                  onChange={handleInputChange}
                  className={styles.inputField}
                >
                  <option value="">Select a type</option>
                  {documentTypes.map((type, index) => (
                    <option key={index} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Provider</label>
                <input
                  type="text"
                  name="provider"
                  value={editForm.provider}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  placeholder="e.g. Dr. Smith, General Hospital"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={editForm.date}
                onChange={handleInputChange}
                className={styles.inputField}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Notes</label>
              <textarea
                name="notes"
                value={editForm.notes}
                onChange={handleInputChange}
                className={styles.textareaField}
                rows={4}
                placeholder="Add any additional notes about this document"
              ></textarea>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                <FiX /> Cancel
              </button>
              <button type="submit" className={styles.saveButton}>
                <FiSave /> Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.documentDetails}>
          <div className={styles.documentHeader}>
            <div className={styles.documentIcon}>{getDocumentIcon()}</div>
            <div className={styles.documentHeaderInfo}>
              <h1>{document.title}</h1>
              <div className={styles.documentMeta}>
                {document.type && (
                  <span className={styles.documentType}>{document.type}</span>
                )}
                {document.provider && (
                  <span className={styles.documentProvider}>
                    {document.provider}
                  </span>
                )}
                <span className={styles.documentDate}>
                  {document.date
                    ? formatDateForDisplay(document.date)
                    : formatDateForDisplay(document.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {document.fileUrl && (
            <div className={styles.documentPreview}>
              {document.fileUrl.startsWith('data:application/pdf') ? (
                <div className={styles.pdfViewer}>
                  <object
                    data={document.fileUrl}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    className={styles.pdfObject}
                  >
                    <p>
                      PDF preview not available.{' '}
                      <a
                        href={document.fileUrl}
                        download={document.title || 'document.pdf'}
                      >
                        Click here to download
                      </a>
                      .
                    </p>
                  </object>
                </div>
              ) : document.fileUrl.startsWith('data:image/') ? (
                <img
                  src={document.fileUrl}
                  alt={document.title}
                  className={styles.imagePreview}
                />
              ) : (
                <div className={styles.noPreview}>
                  <FiFile size={48} />
                  <p>Preview not available for this file type</p>
                </div>
              )}
              <a
                href={document.fileUrl}
                download={document.title || 'document'}
                className={styles.downloadButton}
              >
                <FiDownload /> Download
              </a>
            </div>
          )}

          {document.notes && (
            <div className={styles.notesSection}>
              <h2>Notes</h2>
              <div className={styles.notesContent}>{document.notes}</div>
            </div>
          )}

          {document.tags && document.tags.length > 0 && (
            <div className={styles.tagsSection}>
              <h2>Tags</h2>
              <div className={styles.tagsContainer}>
                {document.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentViewPage;
