// LandingPage.js
import React, { useEffect, useState } from 'react'; // Added useState
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi'; // Added menu icons
import HeroSection from '../../components/landing/HeroSection';
import ProblemStatement from '../../components/landing/ProblemStatement';
import FeatureShowcase from '../../components/landing/FeatureShowcase';
import TeamSection from '../../components/landing/TeamSection';
import ContactForm from '../../components/landing/ContactForm';
import Footer from '../../components/landing/Footer';
import styles from './LandingPage.module.css';
// Import the logo
import carevaultLogo from '../../assets/images/carevault-logo.png';

const LandingPage = () => {
  // State for mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Features data
  const features = [
    {
      id: 'feature-1',
      title: 'Document Management',
      description:
        'Securely store, organize, and retrieve your medical documents with AI-powered organization.',
      icon: 'document',
      color: '#4CAF50',
    },
    {
      id: 'feature-2',
      title: 'Smart Health Assistant',
      description:
        'Get personalized health insights and answers to your questions through our advanced AI chat interface.',
      icon: 'chat',
      color: '#2196F3',
    },
    {
      id: 'feature-3',
      title: 'Appointment Scheduler',
      description:
        'Easily book and manage healthcare appointments with seamless calendar integration.',
      icon: 'calendar',
      color: '#FF9800',
    },
    {
      id: 'feature-4',
      title: 'Medication Management',
      description:
        'Never miss a dose with our medication tracking and reminder system.',
      icon: 'medication',
      color: '#9C27B0',
    },
    {
      id: 'feature-5',
      title: 'Health Insights Dashboard',
      description:
        'Visualize your health data and receive personalized recommendations.',
      icon: 'chart',
      color: '#F44336',
    },
    {
      id: 'feature-6',
      title: 'Caregiver Support',
      description:
        'Manage multiple patient profiles with comprehensive caregiver tools.',
      icon: 'users',
      color: '#00BCD4',
    },
  ];

  // Problem statement data
  const problemData = {
    mainProblem:
      'Managing healthcare is a multifaceted challenge for both patients and caregivers.',
    impacts: [
      'Patients struggle with organizing records, tracking medications, and explaining medical history.',
      'Caregivers face greater challenges handling multiple patient profiles.',
      'Disorganized healthcare management can lead to missed medications and delayed treatments.',
    ],
    subProblems: [
      'Medical records, prescriptions, and test results are spread across multiple platforms.',
      "Fragmented healthcare data makes it difficult to get a complete picture of one's health.",
      'Caregivers lack efficient tools to manage multiple patient profiles.',
      'Manual medication tracking is prone to human error.',
    ],
    importance: [
      'Improves patient safety by reducing medical errors.',
      'Enhances quality of life for patients and caregivers.',
      'Reduces healthcare costs through better coordination.',
      'Supports vulnerable populations who need assistance managing their healthcare.',
    ],
  };

  // Team data - updated to match the image IDs in the TeamSection component
  const teamData = [
    {
      id: 'team-1',
      name: 'Raunak Choudhary',
      role: 'Project Lead & Developer',
      bio: 'NYU Computer Science graduate student specializing in Human-Computer Interaction.',
      netId: 'rc5553',
      email: 'raunak.choudhary@nyu.edu',
      linkedin: 'https://linkedin.com/in/raunakchoudhary',
      github: 'https://github.com/raunakchoudhary',
    },
    {
      id: 'team-2',
      name: 'Aninda Ghosh',
      role: 'UI/UX Designer & Developer',
      bio: 'NYU Computer Science graduate student with expertise in user experience design.',
      netId: 'ag10293',
      email: 'ag10293@nyu.edu',
      linkedin: 'https://linkedin.com/in/anindaghosh',
      github: 'https://github.com/anindaghosh',
    },
  ];

  return (
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            {/* Updated to use the imported logo */}
            <img
              src={carevaultLogo}
              alt="CareVault Logo"
              className={styles.logoIcon}
              width="32"
              height="32"
            />
            <span className={styles.logoText}>CareVault</span>
          </Link>
          {/* Desktop Navigation */}
          <nav className={styles.navigation}>
            <a href="#problem" className={styles.navLink}>
              Problem
            </a>
            <a href="#features" className={styles.navLink}>
              Features
            </a>
            <a href="#team" className={styles.navLink}>
              Team
            </a>
            <a href="#contact" className={styles.navLink}>
              Contact
            </a>
          </nav>
          {/* Desktop Auth Buttons */}
          <div className={styles.authButtons}>
            <Link to="/login" className={styles.loginButton}>
              Log In
            </Link>
            <Link to="/register" className={styles.registerButton}>
              Sign Up
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}
      >
        <a
          href="#problem"
          className={styles.mobileNavLink}
          onClick={closeMobileMenu}
        >
          Problem
        </a>
        <a
          href="#features"
          className={styles.mobileNavLink}
          onClick={closeMobileMenu}
        >
          Features
        </a>
        <a
          href="#team"
          className={styles.mobileNavLink}
          onClick={closeMobileMenu}
        >
          Team
        </a>
        <a
          href="#contact"
          className={styles.mobileNavLink}
          onClick={closeMobileMenu}
        >
          Contact
        </a>
        <div className={styles.mobileAuthButtons}>
          <Link
            to="/login"
            className={`${styles.loginButton} ${styles.mobileNavLink}`}
            onClick={closeMobileMenu}
          >
            Log In
          </Link>
          <Link
            to="/register"
            className={`${styles.registerButton} ${styles.mobileNavLink}`}
            onClick={closeMobileMenu}
          >
            Sign Up
          </Link>
        </div>
      </div>

      <main>
        <HeroSection />

        <section id="problem" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Problem Statement</h2>
              <p className={styles.sectionSubtitle}>
                Understanding the challenges in healthcare management
              </p>
            </div>
            <ProblemStatement problemData={problemData} />
          </div>
        </section>

        <section id="features" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Our Solution</h2>
              <p className={styles.sectionSubtitle}>
                A comprehensive healthcare management platform
              </p>
            </div>
            <FeatureShowcase features={features} />
          </div>
        </section>

        <section id="team" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Meet Our Team</h2>
              <p className={styles.sectionSubtitle}>
                The minds behind CareVault
              </p>
            </div>
            <TeamSection team={teamData} />
          </div>
        </section>

        <section id="contact" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Get In Touch</h2>
              <p className={styles.sectionSubtitle}>
                Have questions about our project? Contact us!
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
