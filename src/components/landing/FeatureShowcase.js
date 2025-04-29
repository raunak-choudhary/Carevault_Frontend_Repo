// FeatureShowcase.js
import React, { useEffect, useRef, useState } from 'react';
import { 
  FiFile, 
  FiMessageCircle, 
  FiCalendar, 
  FiPackage, 
  FiActivity, 
  FiUsers,
  FiArrowRight
} from 'react-icons/fi';
import styles from './FeatureShowcase.module.css';
// Import the logo
import carevaultLogo from '../../assets/images/carevault-logo.png';

const FeatureShowcase = ({ features }) => {
  const featureRefs = useRef([]);
  // Removed activeFeature state
  const [deviceRotation, setDeviceRotation] = useState(0);
  const [animateDevice, setAnimateDevice] = useState(false);
  
  // Intersection Observer for feature animation on scroll
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animate);
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    const currentRefs = featureRefs.current.filter(ref => ref !== null);
    
    currentRefs.forEach(ref => {
      observer.observe(ref);
    });
    
    return () => {
      // Check if observer exists before unobserving
      if (observer) {
        currentRefs.forEach(ref => {
          if (ref) { // Check if ref exists before unobserving
            observer.unobserve(ref);
          }
        });
      }
    };
  }, []); // Removed features from dependency array if not needed for observer logic

  // Animation for device rotation
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setDeviceRotation(prev => (prev + 1) % 360);
    }, 50);

    // Animation toggle for device
    const animationInterval = setInterval(() => {
      setAnimateDevice(prev => !prev);
    }, 3000);
    
    return () => {
      clearInterval(rotationInterval);
      clearInterval(animationInterval);
    };
  }, []);
  
  // Function to get the appropriate icon
  const getFeatureIcon = (iconName, color) => {
    switch (iconName) {
      case 'document':
        return <FiFile size={30} color={color} />;
      case 'chat':
        return <FiMessageCircle size={30} color={color} />;
      case 'calendar':
        return <FiCalendar size={30} color={color} />;
      case 'medication':
        return <FiPackage size={30} color={color} />;
      case 'chart':
        return <FiActivity size={30} color={color} />;
      case 'users':
        return <FiUsers size={30} color={color} />;
      default:
        return <FiFile size={30} color={color} />;
    }
  };
  
  // Removed handleFeatureFocus and handleFeatureBlur functions

  return (
    <div className={styles.featureShowcaseContainer}>
      <div className={styles.featureShowcase}>
        {features.map((feature, index) => (
          <div 
            key={feature.id} 
            // Removed activeFeature logic from className
            className={styles.featureCard}
            ref={el => featureRefs.current[index] = el}
            style={{
              '--delay': `${index * 0.1}s`,
              '--feature-color': feature.color
            }}
            // Removed hover/focus event handlers that managed state
            tabIndex={0} // Keep for accessibility focus
          >
            <div className={styles.iconWrapper} style={{ backgroundColor: `${feature.color}10` }}>
              {getFeatureIcon(feature.icon, feature.color)}
            </div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDesc}>{feature.description}</p>
            
            {/* Demo Preview Animation based on feature type */}
            <div className={styles.demoPreview}>
              {feature.icon === 'document' && (
                <div className={styles.documentDemo}>
                  <div className={styles.documentList}>
                    <div className={styles.documentItem}></div>
                    <div className={styles.documentItem}></div>
                    <div className={styles.documentItem}></div>
                  </div>
                </div>
              )}
              
              {feature.icon === 'chat' && (
                <div className={styles.chatDemo}>
                  <div className={styles.chatBubble}></div>
                  <div className={styles.chatBubble}></div>
                  <div className={styles.chatInput}></div>
                </div>
              )}
              
              {feature.icon === 'calendar' && (
                <div className={styles.calendarDemo}>
                  <div className={styles.calendarGrid}>
                    {Array(9).fill().map((_, i) => (
                      <div key={i} className={styles.calendarDay}></div>
                    ))}
                  </div>
                </div>
              )}
              
              {feature.icon === 'medication' && (
                <div className={styles.medicationDemo}>
                  <div className={styles.pillContainer}>
                    <div className={styles.pill}></div>
                    <div className={styles.pill}></div>
                    <div className={styles.pill}></div>
                  </div>
                </div>
              )}
              
              {feature.icon === 'chart' && (
                <div className={styles.chartDemo}>
                  <div className={styles.chart}>
                    <div className={styles.chartBar} style={{ height: '60%' }}></div>
                    <div className={styles.chartBar} style={{ height: '80%' }}></div>
                    <div className={styles.chartBar} style={{ height: '40%' }}></div>
                    <div className={styles.chartBar} style={{ height: '70%' }}></div>
                  </div>
                </div>
              )}
              
              {feature.icon === 'users' && (
                <div className={styles.usersDemo}>
                  <div className={styles.userCircle}></div>
                  <div className={styles.userCircle}></div>
                  <div className={styles.userCircle}></div>
                </div>
              )}
            </div>
            
            <div className={styles.featureMore}>
              <span className={styles.moreText}>Learn more</span>
              <FiArrowRight className={styles.arrowIcon} />
            </div>
            
            <div className={styles.hoverEffect}></div>
          </div>
        ))}
      </div>
      
      <div className={styles.integratedView}>
        <div className={styles.integrationHeader}>
          <h3>Complete Integrated Solution</h3>
          <p>All features work together in a seamless, unified platform</p>
        </div>
        <div className={styles.integrationDemo}>
          <div 
            className={`${styles.deviceFrame} ${animateDevice ? styles.pulseDevice : ''}`}
            style={{ transform: `perspective(1000px) rotateY(${deviceRotation/10}deg)` }}
          >
            <div className={styles.deviceScreen}>
              <div className={styles.appInterface}>
                <div className={styles.appHeader}>
                  <div className={styles.appLogo}>
                    {/* Using the imported logo instead of SVG */}
                    <img src={carevaultLogo} alt="CareVault Logo" className={styles.logoImg} width="20" height="20" />
                    <span>CareVault</span>
                  </div>
                </div>
                <div className={styles.appContent}>
                  <div className={styles.appNav}>
                    <div className={styles.navItem}></div>
                    <div className={styles.navItem}></div>
                    <div className={styles.navItem}></div>
                    <div className={styles.navItem}></div>
                  </div>
                  <div className={styles.appMain}>
                    <div className={`${styles.appWidget} ${animateDevice ? styles.widgetActive : ''}`}></div>
                    <div className={styles.appWidgetsGrid}>
                      <div className={`${styles.appWidgetSmall} ${animateDevice ? styles.widgetActive : ''}`}></div>
                      <div className={`${styles.appWidgetSmall} ${animateDevice ? styles.widgetActive : ''}`}></div>
                      <div className={`${styles.appWidgetSmall} ${animateDevice ? styles.widgetActive : ''}`}></div>
                      <div className={`${styles.appWidgetSmall} ${animateDevice ? styles.widgetActive : ''}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Connectors */}
          <div className={styles.connectors}>
            {features.map((feature, index) => {
              // Calculate positions for connectors
              const angle = index * (360 / features.length);
              const radians = (angle * Math.PI) / 180;
              const x = Math.cos(radians) * 150;
              const y = Math.sin(radians) * 150;
              
              return (
                <div 
                  key={`connector-${index}`} 
                  className={`${styles.connector} ${animateDevice ? styles.pulseConnector : ''}`}
                  style={{
                    '--connector-angle': `${angle}deg`,
                    '--connector-color': feature.color,
                    transform: `translate(${x}px, ${y}px)`
                  }}
                >
                  <div 
                    className={styles.connectorNode} 
                    style={{ 
                      backgroundColor: feature.color,
                      animation: `pulse ${index % 3 + 2}s infinite ease-in-out ${index * 0.3}s`
                    }}
                  >
                    {getFeatureIcon(feature.icon, '#fff')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;