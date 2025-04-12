import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiClock, FiStar, FiX, FiChevronRight } from 'react-icons/fi';
import styles from './ProviderCard.module.css';

const ProviderCard = ({ provider, detailed = false, selected = false, onSelect, onClose }) => {
  // Format rating to include decimal point only if needed
  const formatRating = (rating) => {
    return rating % 1 === 0 ? rating.toFixed(0) : rating.toFixed(1);
  };
  
  // Add stars for rating
  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className={styles.ratingStars}>
        {Array.from({ length: fullStars }).map((_, index) => (
          <FiStar key={index} className={styles.starFilled} />
        ))}
        
        {hasHalfStar && <FiStar className={styles.starHalf} />}
        
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, index) => (
          <FiStar key={`empty-${index}`} className={styles.starEmpty} />
        ))}
      </div>
    );
  };
  
  return (
    <div 
      className={`${styles.providerCard} ${detailed ? styles.detailedCard : ''} ${selected ? styles.selectedCard : ''}`}
      onClick={onSelect}
    >
      {detailed && onClose && (
        <button className={styles.closeButton} onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}>
          <FiX />
        </button>
      )}
      
      <div className={styles.providerHeader}>
        <div className={styles.providerAvatar}>
          {provider.imageUrl ? (
            <img src={provider.imageUrl} alt={provider.name} className={styles.providerImage} />
          ) : (
            <div className={styles.providerInitial}>
              {provider.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className={styles.providerInfo}>
          <h3 className={styles.providerName}>{provider.name}</h3>
          <p className={styles.providerSpecialty}>{provider.specialization}</p>
          
          {provider.rating && (
            <div className={styles.providerRating}>
              <span className={styles.ratingValue}>{formatRating(provider.rating)}</span>
              {renderRatingStars(provider.rating)}
              {provider.reviewCount && (
                <span className={styles.reviewCount}>({provider.reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.providerDetails}>
        {provider.address && (
          <div className={styles.detailItem}>
            <FiMapPin className={styles.detailIcon} />
            <span>{provider.address}</span>
          </div>
        )}
        
        {provider.phone && (
          <div className={styles.detailItem}>
            <FiPhone className={styles.detailIcon} />
            <span>{provider.phone}</span>
          </div>
        )}
        
        {provider.hours && (
          <div className={styles.detailItem}>
            <FiClock className={styles.detailIcon} />
            <span>{provider.hours}</span>
          </div>
        )}
      </div>
      
      {detailed && provider.about && (
        <div className={styles.providerAbout}>
          <h4>About</h4>
          <p>{provider.about}</p>
        </div>
      )}
      
      {detailed ? (
        <Link 
          to={`/appointments/create?providerId=${provider.id}`} 
          className={styles.scheduleButton}
          onClick={(e) => e.stopPropagation()}
        >
          Schedule Appointment
        </Link>
      ) : (
        <Link to={`/appointments/providers/${provider.id}`} className={styles.providerAction} onClick={(e) => e.stopPropagation()}>
          <FiChevronRight className={styles.actionIcon} />
        </Link>
      )}
    </div>
  );
};

export default ProviderCard;