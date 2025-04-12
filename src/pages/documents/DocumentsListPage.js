import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiFileText, FiSearch, FiAlertCircle } from 'react-icons/fi';
import DocumentCard from '../../components/documents/DocumentCard';
import DocumentFilter from '../../components/documents/DocumentFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getUserDocuments, searchDocuments, filterDocuments, deleteDocument } from '../../services/authService';
import styles from './DocumentsListPage.module.css';

const DocumentsListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    type: '',
    provider: '',
    startDate: '',
    endDate: ''
  });
  
  // Fetch documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const docs = await getUserDocuments();
        setDocuments(docs);
        setFilteredDocuments(docs);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, []);
  
  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    try {
      setLoading(true);
      
      if (!query && !hasActiveFilters()) {
        // If no search query and no filters, show all documents
        setFilteredDocuments(documents);
      } else {
        // Otherwise, apply search and/or filters
        const results = await searchDocuments(query);
        
        // Apply any active filters to search results
        if (hasActiveFilters()) {
          const filtered = await filterDocuments(activeFilters);
          
          // Intersection of search results and filtered results
          const intersection = results.filter(doc => 
            filtered.some(filteredDoc => filteredDoc.id === doc.id)
          );
          
          setFilteredDocuments(intersection);
        } else {
          setFilteredDocuments(results);
        }
      }
    } catch (err) {
      console.error('Error searching documents:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = async (filters) => {
    setActiveFilters(filters);
    
    try {
      setLoading(true);
      
      if (!hasActiveFilters(filters) && !searchQuery) {
        // If no filters and no search query, show all documents
        setFilteredDocuments(documents);
      } else {
        // Apply filters
        const filtered = await filterDocuments(filters);
        
        // If there's also a search query, intersect with search results
        if (searchQuery) {
          const searchResults = await searchDocuments(searchQuery);
          
          const intersection = filtered.filter(doc => 
            searchResults.some(searchDoc => searchDoc.id === doc.id)
          );
          
          setFilteredDocuments(intersection);
        } else {
          setFilteredDocuments(filtered);
        }
      }
    } catch (err) {
      console.error('Error filtering documents:', err);
      setError('Failed to apply filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Check if any filters are active
  const hasActiveFilters = (filters = activeFilters) => {
    return Object.values(filters).some(value => value !== '');
  };
  
  // Handle document deletion
  const handleDocumentDelete = async (id) => {
    try {
      setLoading(true);
      await deleteDocument(id);
      
      // Update both document lists
      const updatedDocs = documents.filter(doc => doc.id !== id);
      setDocuments(updatedDocs);
      setFilteredDocuments(filteredDocuments.filter(doc => doc.id !== id));
      
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.documentsPage}>
      <div className={styles.pageHeader}>
        <h1>My Documents</h1>
        <Link to="/documents/upload" className={styles.uploadButton}>
          <FiPlus /> Upload Document
        </Link>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          <FiAlertCircle /> {error}
        </div>
      )}
      
      <DocumentFilter 
        onFilterChange={handleFilterChange} 
        onSearch={handleSearch}
      />
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className={styles.documentsList}>
          {filteredDocuments.map(doc => (
            <DocumentCard 
              key={doc.id} 
              document={doc} 
              onDelete={handleDocumentDelete}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          {searchQuery || hasActiveFilters() ? (
            <div>
              <FiSearch size={48} />
              <h2>No documents found</h2>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                className={styles.clearButton}
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilters({
                    type: '',
                    provider: '',
                    startDate: '',
                    endDate: ''
                  });
                  setFilteredDocuments(documents);
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div>
              <FiFileText size={48} />
              <h2>No documents yet</h2>
              <p>Upload your first document to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentsListPage;