import React, { createContext, useState, useEffect } from 'react';
import {
  getUserDocuments,
  uploadDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
  filterDocuments,
  searchDocuments,
} from '../services/authService'; // Will be moved to a documentService in future phases

// Create context
export const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const docs = await getUserDocuments();
        setDocuments(docs);
        setError(null);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };
    if (localStorage.getItem('access_token')) fetchDocuments();
  }, []);

  // Upload a new document
  const addDocument = async (documentData) => {
    try {
      setLoading(true);
      const newDoc = await uploadDocument(documentData);
      setDocuments((prevDocs) => [newDoc, ...prevDocs]);
      return newDoc;
    } catch (err) {
      console.error('Error uploading document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a single document by ID
  const getDocument = async (id) => {
    try {
      setLoading(true);
      // First check if we already have it in state
      const existingDoc = documents.find((doc) => doc.id === id);
      if (existingDoc) {
        return existingDoc;
      }

      // If not, fetch from API
      const doc = await getDocumentById(id);
      return doc;
    } catch (err) {
      console.error(`Error getting document ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a document
  const updateDoc = async (id, updates) => {
    try {
      setLoading(true);
      const updatedDoc = await updateDocument(id, updates);

      // Update in state
      setDocuments((prevDocs) =>
        prevDocs.map((doc) => (doc.id === id ? updatedDoc : doc)),
      );

      return updatedDoc;
    } catch (err) {
      console.error(`Error updating document ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a document
  const removeDocument = async (id) => {
    try {
      setLoading(true);
      await deleteDocument(id);

      // Remove from state
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));

      return { success: true };
    } catch (err) {
      console.error(`Error deleting document ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filter documents
  const filterDocs = async (filters) => {
    try {
      setLoading(true);
      const filteredDocs = await filterDocuments(filters);
      return filteredDocs;
    } catch (err) {
      console.error('Error filtering documents:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Search documents
  const searchDocs = async (query) => {
    try {
      setLoading(true);
      const searchResults = await searchDocuments(query);
      return searchResults;
    } catch (err) {
      console.error('Error searching documents:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        loading,
        error,
        addDocument,
        getDocument,
        updateDoc,
        removeDocument,
        filterDocs,
        searchDocs,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
