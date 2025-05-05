import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiSun,
  FiMoon,
  FiLogOut,
  FiSettings,
  FiChevronDown,
  FiMenu,
  FiSearch,
} from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { usePatients } from '../../hooks/usePatients';
import QuickPatientSwitcher from '../patients/QuickPatientSwitcher';
import PatientSearchModal from '../patients/PatientSearchModal';
import styles from './Header.module.css';

const Header = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, isCaregiver } = useAuth();
  const { setActivePatient } = usePatients();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  // Handle patient selection from search modal with error handling
  const handlePatientSelect = async (patient) => {
    try {
      // First set the active patient and wait for it to complete
      await setActivePatient(patient.id);

      // Then navigate after patient is set
      navigate(`/patient/${patient.id}/dashboard`);

      // Close the search modal
      setPatientSearchOpen(false);
    } catch (error) {
      console.error('Error selecting patient from search:', error);
      // Handle the error - could show a toast or alert
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          className={styles.menuButton}
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <FiMenu />
        </button>

        <Link to="/dashboard" className={styles.logo}>
          <span className={styles.logoText}>CareVault</span>
        </Link>
      </div>

      <div className={styles.headerCenter}>
        {isCaregiver() && (
          <>
            <QuickPatientSwitcher />
            <button
              className={styles.searchButton}
              onClick={() => setPatientSearchOpen(true)}
              aria-label="Search patients"
            >
              <FiSearch />
            </button>
          </>
        )}
      </div>

      <div className={styles.headerRight}>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={
            theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
          }
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

        {user ? (
          <div className={styles.userMenu} ref={dropdownRef}>
            <button
              className={styles.profileButton}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className={styles.profileAvatar}>
                {user.firstName && user.lastName
                  ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                  : 'U'}
              </div>
              <span className={styles.userName}>
                {user.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
              </span>
              <FiChevronDown
                className={`${styles.dropdownIcon} ${dropdownOpen ? styles.dropdownIconOpen : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className={styles.dropdown}>
                <Link
                  to="/profile"
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  <FiUser className={styles.dropdownItemIcon} />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  <FiSettings className={styles.dropdownItemIcon} />
                  <span>Settings</span>
                </Link>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  <FiLogOut className={styles.dropdownItemIcon} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className={styles.profileButton}>
            <FiUser className={styles.profileIcon} />
            <span>Sign In</span>
          </Link>
        )}
      </div>

      {/* Patient Search Modal */}
      <PatientSearchModal
        isOpen={patientSearchOpen}
        onClose={() => setPatientSearchOpen(false)}
        onSelectPatient={handlePatientSelect}
      />
    </header>
  );
};

export default Header;
