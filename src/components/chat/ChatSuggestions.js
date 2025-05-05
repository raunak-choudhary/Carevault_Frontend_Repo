import React from 'react';
import styles from './ChatSuggestions.module.css';

const ChatSuggestions = ({
  suggestions = [],
  onSuggestionClick,
  isVisible = true,
}) => {
  if (!isVisible || !suggestions.length) {
    return null;
  }

  return (
    <div className={styles.suggestionsContainer}>
      <div className={styles.suggestionsLabel}>Suggested questions:</div>
      <div className={styles.suggestions}>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className={styles.suggestion}
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSuggestions;
