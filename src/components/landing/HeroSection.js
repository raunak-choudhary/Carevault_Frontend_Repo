// HeroSection.js
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import styles from './HeroSection.module.css';
// Import the image from the correct path
import appScreenshot from '../../assets/images/app-screenshot.png';

const HeroSection = () => {
  const heroRef = useRef(null);
  const medicationAnimationRef = useRef(null); // Ref for the animation container
  const backgroundShapesRef = useRef(null); // Ref for background shapes container
  const [isVisible, setIsVisible] = useState(false);

  // Animation for typing effect
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Your personal healthcare management platform.';
  const typingSpeed = 50; // milliseconds per character

  // Setup animation when component mounts and add parallax effect
  useEffect(() => {
    // Entrance visibility
    setIsVisible(true);

    // Typing effect
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    // Parallax effect on scroll - ONLY for background shapes
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const parallaxFactorShapes = 0.1; // Even slower for background shapes

      if (backgroundShapesRef.current) {
        backgroundShapesRef.current.style.transform = `translateY(${scrollY * parallaxFactorShapes}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function
    return () => {
      clearInterval(typingInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const numLanes = 8; // Define number of vertical lanes

  return (
    <section
      className={`${styles.heroSection} ${isVisible ? styles.visible : ''}`}
      ref={heroRef}
    >
      {/* Background Shapes Container - Apply parallax here */}
      <div className={styles.heroBackground} ref={backgroundShapesRef}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
      </div>

      {/* Medication Animation Container - Moved outside heroImage, spans entire section */}
      <div className={styles.medicationAnimation} ref={medicationAnimationRef}>
        {/* Generate pills with different sizes and colors */}
        {Array.from({ length: 15 }).map((_, index) => {
          const lane = index % numLanes;
          const lanePosition = `${(lane / (numLanes - 1)) * 90 + 5}%`; // Distribute across 90% width, offset by 5%
          return (
            <div
              key={`pill-${index}`}
              className={styles.floatingPill}
              style={{
                '--delay': `${Math.random() * 10}s`, // Randomize delay for better distribution
                '--duration': `${8 + Math.random() * 6}s`, // Varied duration
                '--lane-position': lanePosition,
                '--size': `${15 + Math.random() * 20}px`, // Slightly smaller pills
                '--rotate': `${Math.random() * 360}deg`,
                '--color':
                  index % 5 === 0
                    ? 'rgba(76, 175, 80, 0.7)' // Green
                    : index % 5 === 1
                      ? 'rgba(33, 150, 243, 0.6)' // Blue
                      : index % 5 === 2
                        ? 'rgba(255, 152, 0, 0.6)' // Orange
                        : index % 5 === 3
                          ? 'rgba(156, 39, 176, 0.5)' // Purple
                          : 'rgba(0, 188, 212, 0.65)', // Teal
              }}
            />
          );
        })}

        {/* Enhanced multi-colored transparent capsules */}
        {Array.from({ length: 20 }).map((_, index) => {
          const lane = (index + Math.floor(numLanes / 2)) % numLanes; // Offset capsule lanes
          const lanePosition = `${(lane / (numLanes - 1)) * 90 + 5}%`; // Distribute across 90% width, offset by 5%
          return (
            <div
              key={`capsule-${index}`}
              className={styles.floatingCapsule}
              style={{
                '--delay': `${Math.random() * 12}s`, // Randomize delay
                '--duration': `${10 + Math.random() * 7}s`, // Varied duration
                '--lane-position': lanePosition,
                '--width': `${25 + Math.random() * 20}px`, // Slightly smaller capsules
                '--height': `${12 + Math.random() * 10}px`,
                '--rotate': `${Math.random() * 360}deg`,
                '--color1':
                  index % 6 === 0
                    ? 'rgba(76, 175, 80, 0.7)' // Green
                    : index % 6 === 1
                      ? 'rgba(33, 150, 243, 0.6)' // Blue
                      : index % 6 === 2
                        ? 'rgba(255, 152, 0, 0.6)' // Orange
                        : index % 6 === 3
                          ? 'rgba(156, 39, 176, 0.5)' // Purple
                          : index % 6 === 4
                            ? 'rgba(0, 188, 212, 0.65)' // Teal
                            : 'rgba(233, 30, 99, 0.55)', // Pink
                '--color2':
                  index % 6 === 0
                    ? 'rgba(139, 195, 74, 0.7)' // Light Green
                    : index % 6 === 1
                      ? 'rgba(3, 169, 244, 0.6)' // Light Blue
                      : index % 6 === 2
                        ? 'rgba(255, 193, 7, 0.6)' // Amber
                        : index % 6 === 3
                          ? 'rgba(186, 104, 200, 0.5)' // Light Purple
                          : index % 6 === 4
                            ? 'rgba(77, 208, 225, 0.65)' // Light Teal
                            : 'rgba(240, 98, 146, 0.55)', // Light Pink
              }}
            />
          );
        })}
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          <span className={styles.titleAnimation}>AI-Powered</span>{' '}
          <span className={styles.highlight}>Healthcare Management</span>
        </h1>
        <p className={styles.heroSubtitle}>{displayText}</p>
        <div className={styles.heroCta}>
          <Link to="/register" className={styles.primaryButton}>
            Get Started
          </Link>
          <Link to="/demo" className={styles.secondaryButton}>
            View Demo
          </Link>
        </div>
        <div className={styles.heroBadges}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>
              <FiCheck />
            </span>
            HIPAA Compliant
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>
              <FiCheck />
            </span>
            AI-Powered
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>
              <FiCheck />
            </span>
            NYU CS Project
          </div>
        </div>
      </div>

      <div className={styles.heroImage}>
        <img
          src={appScreenshot}
          alt="CareVault Dashboard"
          className={styles.mainImage}
        />
        {/* Medication animation container moved outside */}
      </div>
    </section>
  );
};

export default HeroSection;
