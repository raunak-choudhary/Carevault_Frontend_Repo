import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiMessageSquare, FiSettings } from 'react-icons/fi';
import styles from './CaregiverNavigation.module.css';

const CaregiverNavigation = () => {
  const location = useLocation();

  const navItems = [
    {
      to: '/dashboard',
      icon: <FiHome className={styles.navIcon} />,
      label: 'Home',
    },
    {
      to: '/patients',
      icon: <FiUsers className={styles.navIcon} />,
      label: 'Patients',
    },
    {
      to: '/chat',
      icon: <FiMessageSquare className={styles.navIcon} />,
      label: 'Assist',
    },
    {
      to: '/settings',
      icon: <FiSettings className={styles.navIcon} />,
      label: 'Settings',
    },
  ];

  // Helper function to check if a route starts with a certain path
  // eslint-disable-next-line no-unused-vars
  const isActiveRoute = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={styles.mobileNav}>
      <div className={styles.navItems}>
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) => {
              // Check all possible active states
              if (
                // Direct match
                isActive ||
                // For patients, check if we're on a patient-specific page
                (item.to === '/patients' &&
                  location.pathname.includes('/patient/'))
              ) {
                return `${styles.navItem} ${styles.navItemActive}`;
              }
              return styles.navItem;
            }}
          >
            {item.icon}
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default CaregiverNavigation;
