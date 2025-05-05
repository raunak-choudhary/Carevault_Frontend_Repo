import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiCheck } from 'react-icons/fi';
import FileUploader from '../../components/documents/FileUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { uploadDocument } from '../../services/authService';
import styles from './DocumentUploadPage.module.css';

const DocumentUploadPage = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    provider: '',
    date: '',
    notes: '',
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Document type options
  const documentTypes = [
    { label: 'Prescription', value: 'prescription' },
    { label: 'Lab Report', value: 'lab-report' },
    { label: 'Imaging', value: 'imaging' },
    { label: 'Visit Summary', value: 'visit-summary' },
    { label: 'Insurance', value: 'insurance' },
    { label: 'Other', value: 'other' },
  ];

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);

    // Auto-fill title with filename (without extension)
    if (selectedFile && !formData.title) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setFormData((prev) => ({
        ...prev,
        title: fileName,
      }));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  // Add tag when Enter is pressed
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      // Add tag if it doesn't already exist
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!formData.title) {
      setError('Please enter a title for the document');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // In a real app, we would upload the file to a server
      // For now, we'll simulate it by creating a document with a fake URL
      const fileUrl = URL.createObjectURL(file);

      // Upload document with form data
      const document = await uploadDocument({
        ...formData,
        fileUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      // Show success message
      setSuccess(true);

      // Redirect to the document view page after a delay
      setTimeout(() => {
        navigate(`/documents/view/${document.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.uploadPage}>
      <div className={styles.pageHeader}>
        <Link to="/documents" className={styles.backButton}>
          <FiArrowLeft /> Back to Documents
        </Link>
        <h1>Upload Document</h1>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {success ? (
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <FiCheck size={32} />
          </div>
          <h2>Document Uploaded Successfully!</h2>
          <p>Redirecting to document view...</p>
          <LoadingSpinner size="small" />
        </div>
      ) : (
        <div className={styles.uploadContainer}>
          <div className={styles.uploadForm}>
            <FileUploader
              onFileSelect={handleFileSelect}
              acceptedFileTypes="image/*, application/pdf"
            />

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Document Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  placeholder="Enter document title"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Document Type</label>
                  <select
                    name="type"
                    value={formData.type}
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
                  <label>Healthcare Provider</label>
                  <input
                    type="text"
                    name="provider"
                    value={formData.provider}
                    onChange={handleInputChange}
                    className={styles.inputField}
                    placeholder="e.g. Dr. Smith, General Hospital"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Document Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className={styles.textareaField}
                  placeholder="Add any additional notes about this document"
                  rows={4}
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label>Tags</label>
                <div className={styles.tagInputContainer}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagKeyDown}
                    className={styles.tagInput}
                    placeholder="Add tags and press Enter"
                  />
                </div>

                {formData.tags.length > 0 && (
                  <div className={styles.tagsContainer}>
                    {formData.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        {tag}
                        <button
                          type="button"
                          className={styles.removeTagButton}
                          onClick={() => removeTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.formActions}>
                <Link to="/documents" className={styles.cancelButton}>
                  Cancel
                </Link>
                <button
                  type="submit"
                  className={styles.uploadButton}
                  disabled={loading || !file}
                >
                  {loading ? (
                    <LoadingSpinner size="small" color="white" />
                  ) : (
                    <>
                      <FiUpload /> Upload Document
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className={styles.uploadInfo}>
            <h3>Tips for Document Upload</h3>
            <ul>
              <li>Ensure the document is clearly legible before uploading</li>
              <li>Supported formats: PDF, JPG, PNG, GIF</li>
              <li>Maximum file size: 10MB</li>
              <li>
                Add relevant tags to make the document easier to find later
              </li>
              <li>Include specific details in notes for future reference</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploadPage;
