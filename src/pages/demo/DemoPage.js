// pages/demo/DemoPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import styles from './DemoPage.module.css';
// Import the logo
import carevaultLogo from '../../assets/images/carevault-logo.png';
// Import the demo video
// import demoVideo from '../../assets/videos/CareVault_Final_Demo.mp4';

const youtubeVideoId = 'ZuuEdnYPFfQ';

const DemoPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const backgroundShapesRef = React.useRef(null);
  const medicationAnimationRef = React.useRef(null);

  useEffect(() => {
    // Make page visible with animation
    setIsVisible(true);

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
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const numLanes = 8; // Define number of vertical lanes

  return (
    <div className={`${styles.demoPage} ${isVisible ? styles.visible : ''}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            <img
              src={carevaultLogo}
              alt="CareVault Logo"
              className={styles.logoIcon}
              width="32"
              height="32"
            />
            <span className={styles.logoText}>CareVault</span>
          </Link>

          <div className={styles.authButtons}>
            <Link to="/login" className={styles.loginButton}>
              Log In
            </Link>
            <Link to="/register" className={styles.registerButton}>
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Background Shapes Container - Apply parallax here */}
      <div className={styles.demoBackground} ref={backgroundShapesRef}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
      </div>

      {/* Medication Animation Container */}
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

      <main className={styles.demoContent}>
        <div className={styles.backButtonContainer}>
          <Link to="/" className={styles.backButton}>
            <FiArrowLeft /> Back to Home
          </Link>
        </div>

        <div className={styles.videoContainer}>
          <h1 className={styles.demoTitle}>CareVault Demo</h1>
          <p className={styles.demoDescription}>
            Watch our platform demo to see how CareVault transforms healthcare
            management with AI assistance, document organization, and more.
          </p>

          <div className={styles.videoWrapper}>
            <iframe
              width="100%"
              height="550"
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              title="CareVault Product Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          <div className={styles.videoControls}>
            <p className={styles.videoInfo}>
              This demonstration showcases the core features of CareVault
              including document management, AI-assisted healthcare, appointment
              scheduling, and medication management.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;
