import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserDocuments } from '../services/authService';
import {
  getChatHistory,
  saveChatHistory,
  generateResponse,
  processFileAttachment,
  getSuggestedQueries,
} from '../services/chatService';

// Create context
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestedQueries, setSuggestedQueries] = useState([]);

  // Load chat history and documents on mount or when user changes
  useEffect(() => {
    if (user) {
      // Load chat history
      const history = getChatHistory();

      // Add welcome message if no history
      if (history.length === 0) {
        const welcomeMessage = {
          id: '1',
          sender: 'ai',
          content: `Hello ${user?.firstName || 'there'}! I'm your CareVault assistant. You can ask me questions about your health records, medications, or appointments. How can I help you today?`,
          timestamp: new Date().toISOString(),
        };

        setMessages([welcomeMessage]);
        saveChatHistory([welcomeMessage]);
      } else {
        setMessages(history);
      }

      // Load documents
      const fetchDocuments = async () => {
        try {
          const docs = await getUserDocuments();
          setDocuments(docs);
        } catch (err) {
          console.error('Error fetching documents for chat context:', err);
        }
      };

      fetchDocuments();
    }
  }, [user]);

  // Update suggested queries when documents or messages change
  useEffect(() => {
    setSuggestedQueries(getSuggestedQueries(documents, messages));
  }, [documents, messages]);

  // Send message to chat assistant
  const sendMessage = async (content, file = null) => {
    if (!content.trim() && !file) return null;

    // Process file attachment if any
    let processedFile = null;
    if (file) {
      try {
        processedFile = await processFileAttachment(file);
      } catch (err) {
        console.error('Error processing file attachment:', err);
      }
    }

    // Create user message
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
      attachment: processedFile,
    };

    // Add to message list
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);

    // Generate AI response
    setLoading(true);

    try {
      // In a future phase, this will connect to the backend AI service
      // For now, we're using a simulated response
      const responseData = await generateResponse(content, file, documents);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: responseData.content,
        timestamp: responseData.timestamp,
        referencedDocuments: responseData.referencedDocuments || [],
      };

      // Add AI response to message list
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

      return aiMessage;
    } catch (err) {
      console.error('Error generating response:', err);

      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content:
          "I'm sorry, I had trouble processing your request. Please try again.",
        timestamp: new Date().toISOString(),
        isError: true,
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

      return errorMessage;
    } finally {
      setLoading(false);
    }
  };

  // Clear chat history
  const clearChat = () => {
    // Keep only the welcome message
    const welcomeMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      content: `Hello ${user?.firstName || 'there'}! I'm your CareVault assistant. You can ask me questions about your health records, medications, or appointments. How can I help you today?`,
      timestamp: new Date().toISOString(),
    };

    setMessages([welcomeMessage]);
    saveChatHistory([welcomeMessage]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        suggestedQueries,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
