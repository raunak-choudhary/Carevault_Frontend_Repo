// BaseLayout.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import CaregiverSidebar from './CaregiverSidebar';
import MobileNavigation from './MobileNavigation';
import CaregiverNavigation from './CaregiverNavigation';
import BreadcrumbNavigation from '../navigation/BreadcrumbNavigation';
import PatientBanner from '../patients/PatientBanner';
import ContextIndicator from '../navigation/ContextIndicator';
import { useAuth } from '../../hooks/useAuth';
import { usePatients } from '../../hooks/usePatients';
import styles from './BaseLayout.module.css';
import { FiMenu } from 'react-icons/fi';

const BaseLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isCaregiver } = useAuth();
  const { activePatient } = usePatients();
  const location = useLocation();

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Check if the current route is the chat page
  const isChatPage = location.pathname.startsWith('/chat');

  // Close sidebar when location changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Determine if we're in patient context by checking the URL
  const isPatientContext = location.pathname.includes('/patient/');

  return (
    <div className={styles.layout}>
      <Header toggleSidebar={toggleSidebar} />

      {isCaregiver() ? (
        <CaregiverSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      ) : (
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      )}

      <main className={`${styles.main} ${isChatPage ? styles.chatLayout : ''}`}>
        <div className={styles.contextHeader}>
          <BreadcrumbNavigation />
          <ContextIndicator />
        </div>

        {activePatient && (
          <div className={styles.patientBannerContainer}>
            <PatientBanner isPatientContext={isPatientContext} />
          </div>
        )}

        {children}
      </main>

      {isCaregiver() ? <CaregiverNavigation /> : <MobileNavigation />}

      {/* Mobile menu button */}
      <button
        className={styles.menuButton}
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
      >
        <FiMenu size={24} />
      </button>
    </div>
  );
};

export default BaseLayout;
