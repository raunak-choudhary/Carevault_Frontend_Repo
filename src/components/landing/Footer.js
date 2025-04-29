// Footer.js
import React from 'react';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import styles from './Footer.module.css';
// Import the logo
import carevaultLogo from '../../assets/images/carevault-logo.png';

const Footer = () => {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <button 
          className={styles.scrollTopButton}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          &#8679;
        </button>
      </div>
      
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <div className={styles.footerLogo}>
            <img 
              src={carevaultLogo} 
              alt="CareVault Logo" 
              className={styles.logoSvg} 
              width="40" 
              height="40"
            />
            <span className={styles.logoText}>CareVault</span>
          </div>
          <p className={styles.footerTagline}>
            AI-Powered Healthcare Management
          </p>
          <p className={styles.footerDesc}>
            A comprehensive platform designed to simplify healthcare management for patients and caregivers.
          </p>
        </div>
        
        <div className={styles.footerNav}>
          <div className={styles.footerNavColumn}>
            <h4 className={styles.footerNavTitle}>Navigate</h4>
            <ul className={styles.footerNavList}>
              <li>
                <a href="#features" className={styles.footerNavLink}>Features</a>
              </li>
              <li>
                <a href="#problem" className={styles.footerNavLink}>Problem Statement</a>
              </li>
              <li>
                <a href="#team" className={styles.footerNavLink}>Our Team</a>
              </li>
              <li>
                <a href="#contact" className={styles.footerNavLink}>Contact</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerConnect}>
          <h4 className={styles.footerNavTitle}>Connect</h4>
          <div className={styles.socialLinks}>
            <a 
              href="https://github.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="GitHub"
            >
              <FiGithub size={20} />
            </a>
            <a 
              href="https://linkedin.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="LinkedIn"
            >
              <FiLinkedin size={20} />
            </a>
            <a 
              href="mailto:contact@carevault.example.com" 
              className={styles.socialLink}
              aria-label="Email"
            >
              <FiMail size={20} />
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} CareVault. Human-Computer Interaction (CS-GY 6543) Project</p>
        </div>
        <div className={styles.footerNotes}>
          <p>New York University</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;