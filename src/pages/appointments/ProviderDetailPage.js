import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiMapPin,
  FiPhone,
  FiClock,
  FiStar,
  FiCalendar,
} from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MapView from '../../components/appointments/MapView';
import { getProviderById } from '../../services/providerService';
import styles from './ProviderDetailPage.module.css';

const ProviderDetailPage = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        const providerData = await getProviderById(id);
        setProvider(providerData);
        setError(null);
      } catch (err) {
        console.error('Error fetching provider:', err);
        setError('Failed to load provider details');
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

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

        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map(
          (_, index) => (
            <FiStar key={`empty-${index}`} className={styles.starEmpty} />
          ),
        )}
      </div>
    );
  };

  return (
    <div className={styles.detailPage}>
      <div className={styles.pageHeader}>
        <Link to="/appointments/providers" className={styles.backButton}>
          <FiArrowLeft /> Back to Providers
        </Link>
        <h1>Provider Details</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {loading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
        </div>
      ) : provider ? (
        <div className={styles.providerContainer}>
          <div className={styles.providerHeader}>
            <div className={styles.providerAvatar}>
              {provider.imageUrl ? (
                <img
                  src={provider.imageUrl}
                  alt={provider.name}
                  className={styles.providerImage}
                />
              ) : (
                <div className={styles.providerInitial}>
                  {provider.name.charAt(0)}
                </div>
              )}
            </div>

            <div className={styles.providerInfo}>
              <h2 className={styles.providerName}>{provider.name}</h2>
              <p className={styles.providerSpecialty}>
                {provider.specialization}
              </p>

              {provider.rating && (
                <div className={styles.providerRating}>
                  <span className={styles.ratingValue}>
                    {formatRating(provider.rating)}
                  </span>
                  {renderRatingStars(provider.rating)}
                  {provider.reviewCount && (
                    <span className={styles.reviewCount}>
                      ({provider.reviewCount} reviews)
                    </span>
                  )}
                </div>
              )}

              <Link
                to={`/appointments/create?providerId=${provider.id}`}
                className={styles.scheduleButton}
              >
                <FiCalendar className={styles.buttonIcon} />
                Schedule Appointment
              </Link>
            </div>
          </div>

          <div className={styles.providerDetails}>
            <div className={styles.detailsSection}>
              <h3>Contact Information</h3>
              {provider.phone && (
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <FiPhone />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Phone</div>
                    <div className={styles.detailValue}>{provider.phone}</div>
                  </div>
                </div>
              )}

              {provider.hours && (
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <FiClock />
                  </div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Office Hours</div>
                    <div className={styles.detailValue}>{provider.hours}</div>
                  </div>
                </div>
              )}
            </div>

            {provider.about && (
              <div className={styles.aboutSection}>
                <h3>About</h3>
                <p className={styles.aboutText}>{provider.about}</p>
              </div>
            )}

            {provider.address && (
              <div className={styles.locationSection}>
                <h3>Location</h3>
                <div className={styles.addressText}>
                  <FiMapPin className={styles.addressIcon} /> {provider.address}
                </div>

                <div className={styles.mapContainer}>
                  <MapView address={provider.address} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.notFoundMessage}>Provider not found</div>
      )}
    </div>
  );
};

export default ProviderDetailPage;
