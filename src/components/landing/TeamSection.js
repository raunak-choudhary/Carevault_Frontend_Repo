// TeamSection.js
import React, { useRef, useState, useEffect } from 'react';
import {
  FiLinkedin,
  FiGithub,
  FiMail,
  FiExternalLink,
  FiUser,
  FiCalendar,
  FiBook,
  FiMapPin,
} from 'react-icons/fi';
import styles from './TeamSection.module.css';
// Import team member images
import raunakImage from '../../assets/images/Raunak_Choudhary.jpg';
import anindaImage from '../../assets/images/Aninda_Ghosh.jpg';

const TeamSection = ({ team }) => {
  const [activeCard, setActiveCard] = useState(null);
  const cardRefs = useRef([]);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Setup intersection observer for animation
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const currentSectionRef = sectionRef.current;

    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  // Handle card interaction
  const handleCardFocus = (index) => {
    setActiveCard(index);
  };

  const handleCardBlur = () => {
    setActiveCard(null);
  };

  // Handle keydown events for accessibility
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveCard(activeCard === index ? null : index);
    }
  };

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  // Function to get team member image
  const getMemberImage = (memberId) => {
    switch (memberId) {
      case 'team-1': // Raunak Choudhary
        return raunakImage;
      case 'team-2': // Aninda Ghosh
        return anindaImage;
      default:
        return null;
    }
  };

  return (
    <div
      className={`${styles.teamSection} ${isVisible ? styles.visible : ''}`}
      ref={sectionRef}
    >
      <div className={styles.teamGrid}>
        {team.map((member, index) => (
          <div
            key={member.id}
            className={`${styles.teamCard} ${activeCard === index ? styles.active : ''}`}
            ref={(el) => (cardRefs.current[index] = el)}
            onMouseEnter={() => handleCardFocus(index)}
            onMouseLeave={handleCardBlur}
            onFocus={() => handleCardFocus(index)}
            onBlur={handleCardBlur}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={0}
            style={{ '--animation-delay': `${index * 0.2}s` }}
          >
            <div className={styles.cardFront}>
              <div className={styles.memberAvatar}>
                {getMemberImage(member.id) ? (
                  <img src={getMemberImage(member.id)} alt={member.name} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <FiUser size={30} />
                    <span>{getInitials(member.name)}</span>
                  </div>
                )}
              </div>
              <div className={styles.memberInfo}>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.role}</p>
              </div>
              <div className={styles.cardActions}>
                <button
                  className={styles.infoButton}
                  aria-label={`View more info about ${member.name}`}
                >
                  <FiExternalLink size={18} />
                </button>
              </div>
            </div>

            <div className={styles.cardBack}>
              <div className={styles.backContent}>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberBio}>{member.bio}</p>

                <div className={styles.memberDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>NetID:</span>
                    <span className={styles.detailValue}>{member.netId}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Email:</span>
                    <span className={styles.detailValue}>{member.email}</span>
                  </div>
                </div>

                <div className={styles.socialLinks}>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label={`Visit ${member.name}'s LinkedIn profile`}
                    >
                      <FiLinkedin size={20} />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label={`Visit ${member.name}'s GitHub profile`}
                    >
                      <FiGithub size={20} />
                    </a>
                  )}
                  <a
                    href={`mailto:${member.email}`}
                    className={styles.socialLink}
                    aria-label={`Email ${member.name}`}
                  >
                    <FiMail size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.projectInfo}>
        <div className={styles.projectMetadata}>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Project:</span>
            <span className={styles.metadataValue}>CareVault</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>
              <FiBook className={styles.metadataIcon} />
              Course:
            </span>
            <span className={styles.metadataValue}>
              Human-Computer Interaction (CS-GY 6543)
            </span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>
              <FiMapPin className={styles.metadataIcon} />
              University:
            </span>
            <span className={styles.metadataValue}>New York University</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>
              <FiCalendar className={styles.metadataIcon} />
              Year:
            </span>
            <span className={styles.metadataValue}>2025</span>
          </div>
        </div>

        <div className={styles.projectDescription}>
          <p>
            CareVault is a comprehensive healthcare management platform designed
            as part of the Human-Computer Interaction course at NYU. The project
            aims to solve the complex challenges of healthcare management using
            artificial intelligence and a user-centered design approach.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
