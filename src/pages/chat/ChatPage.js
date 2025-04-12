import React, { useRef, useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useChat } from '../../hooks/useChat';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInput from '../../components/chat/ChatInput';
import ChatSuggestions from '../../components/chat/ChatSuggestions';
import styles from './ChatPage.module.css';

const ChatPage = () => {
  const { messages, loading, suggestedQueries, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle sending a message
  const handleSendMessage = (content, file) => {
    sendMessage(content, file);
  };
  
  // Handle clicking a suggested query
  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };
  
  // Handle clear chat button click
  const handleClearChat = () => {
    if (showClearConfirm) {
      clearChat();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      
      // Auto-hide the confirmation after 3 seconds
      setTimeout(() => {
        setShowClearConfirm(false);
      }, 3000);
    }
  };
  
  return (
    <div className={styles.chatPage}>
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderContent}>
          <h1>Chat Assistant</h1>
          <p className={styles.chatSubtitle}>
            Ask questions about your health records, medications, or appointments
          </p>
        </div>
        
        {/* Clear chat button */}
        <button 
          className={`${styles.clearChatButton} ${showClearConfirm ? styles.confirmClear : ''}`}
          onClick={handleClearChat}
          title={showClearConfirm ? "Click again to confirm" : "Clear chat history"}
        >
          <FiTrash2 />
          <span>{showClearConfirm ? "Confirm clear" : "Clear chat"}</span>
        </button>
      </div>
      
      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isLast={index === messages.length - 1}
            />
          ))}
          
          {/* Show typing indicator when loading */}
          {loading && (
            <div className={styles.typingIndicatorWrapper}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat input area */}
        <div className={styles.inputArea}>
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={loading} 
          />
          
          {/* Suggested queries */}
          <ChatSuggestions 
            suggestions={suggestedQueries} 
            onSuggestionClick={handleSuggestionClick} 
            isVisible={messages.length < 3}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;