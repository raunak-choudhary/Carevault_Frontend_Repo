import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiFileText, 
  FiMessageSquare, 
  FiCalendar, 
  FiPackage, 
  FiUsers,
  FiSearch,
  FiSettings
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { usePatients } from '../../hooks/usePatients';
import PatientSearchModal from '../patients/PatientSearchModal';
import styles from './MobileNavigation.module.css';

const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCaregiver } = useAuth();
  const { setActivePatient } = usePatients();
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);
  
  // Patient navigation items
  const patientNavItems = [
    { to: "/dashboard", icon: <FiHome className={styles.navIcon} />, label: "Home" },
    { to: "/documents", icon: <FiFileText className={styles.navIcon} />, label: "Docs" },
    { to: "/chat", icon: <FiMessageSquare className={styles.navIcon} />, label: "Assistant" },
    { to: "/appointments", icon: <FiCalendar className={styles.navIcon} />, label: "Appointments" },
    { to: "/medications", icon: <FiPackage className={styles.navIcon} />, label: "Meds" },
    { to: "/settings", icon: <FiSettings className={styles.navIcon} />, label: "Settings" }
  ];
  
  // Caregiver navigation items
  const caregiverNavItems = [
    { to: "/dashboard", icon: <FiHome className={styles.navIcon} />, label: "Home" },
    { to: "/patients", icon: <FiUsers className={styles.navIcon} />, label: "Patients" },
    { to: "/chat", icon: <FiMessageSquare className={styles.navIcon} />, label: "Assistant" },
    { to: "/settings", icon: <FiSettings className={styles.navIcon} />, label: "Settings" },
    { action: "search", icon: <FiSearch className={styles.navIcon} />, label: "Search" }
  ];
  
  // Choose appropriate nav items based on role
  const navItems = isCaregiver() ? caregiverNavItems : patientNavItems;
  
  // Handle patient selection from search
  const handlePatientSelect = (patient) => {
    setActivePatient(patient);
    navigate(`/patient/${patient.id}/dashboard`);
  };
  
  // Handle navigation item click
  const handleNavItemClick = (item) => {
    if (item.action === "search") {
      setPatientSearchOpen(true);
    }
  };

  // Helper function to check if a route starts with a certain path
  const isActiveRoute = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={styles.mobileNav}>
      <div className={styles.navItems}>
        {navItems.map((item, index) => (
          item.action ? (
            <button 
              key={index}
              className={styles.navItem}
              onClick={() => handleNavItemClick(item)}
            >
              {item.icon}
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ) : (
            <NavLink 
              key={index} 
              to={item.to} 
              className={({ isActive }) => {
                // For documents, consider all document routes as active
                if (item.to === '/documents' && isActiveRoute('/documents')) {
                  return `${styles.navItem} ${styles.navItemActive}`;
                }
                // For chat, consider all chat routes as active
                if (item.to === '/chat' && isActiveRoute('/chat')) {
                  return `${styles.navItem} ${styles.navItemActive}`;
                }
                // For appointments, consider all appointment routes as active
                if (item.to === '/appointments' && isActiveRoute('/appointments')) {
                  return `${styles.navItem} ${styles.navItemActive}`;
                }
                // For medications, consider all medication routes as active
                if (item.to === '/medications' && isActiveRoute('/medications')) {
                  return `${styles.navItem} ${styles.navItemActive}`;
                }
                // For insights, consider all insights routes as active
                if (item.to === '/insights' && isActiveRoute('/insights')) {
                  return `${styles.navItem} ${styles.navItemActive}`;
                }
                // For patients, consider all patient routes as active
                if (item.to === '/patients' && isActiveRoute('/patients')) {
                  return `${styles.navItem} ${styles.navItemActive}`;
                }
                // For settings, consider all settings routes as active
                if (item.to === '/settings' && isActiveRoute('/settings')) {
                  return `${styles.navItem} ${styles.navItemActive}`;
                }
                // For dashboard, also consider patient dashboard routes
                if (item.to === '/dashboard' && (isActive || (location.pathname.includes('/patient/') && location.pathname.includes('/dashboard')))) {
                  return `${styles.navItem} ${styles.navItemActive}`;
                }
                return isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem;
              }}
            >
              {item.icon}
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          )
        ))}
      </div>
      
      {/* Patient Search Modal */}
      <PatientSearchModal 
        isOpen={patientSearchOpen} 
        onClose={() => setPatientSearchOpen(false)}
        onSelectPatient={handlePatientSelect}
      />
    </nav>
  );
};

export default MobileNavigation;