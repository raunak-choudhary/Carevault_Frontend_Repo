import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiMessageSquare, FiPieChart } from 'react-icons/fi';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Manage Your Healthcare with CareVault</h1>
          <p className={styles.subtitle}>
            A secure, intelligent platform that simplifies healthcare management for 
            patients and caregivers. Store records, get insights, and plan visits - all in one place.
          </p>
          <Link to="/register" className={styles.ctaButton}>
            Get Started
          </Link>
        </div>
      </section>
      
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Key Features</h2>
        
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <FiFileText className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Medical Document Management</h3>
            <p>
              Upload, organize, and access all your medical records in one secure place.
              Smart classification makes finding documents effortless.
            </p>
          </div>
          
          <div className={styles.feature}>
            <FiMessageSquare className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>AI Chat Assistant</h3>
            <p>
              Get personalized answers about your health records and history
              through our intelligent chat assistant.
            </p>
          </div>
          
          <div className={styles.feature}>
            <FiPieChart className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Health Insights</h3>
            <p>
              Visualize your health trends and receive personalized recommendations
              based on your medical history.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;