// src/components/settings/SettingsNav.js
import React from 'react';
import { FiUser, FiBell, FiShield, FiUsers } from 'react-icons/fi';
import styles from './SettingsNav.module.css';

const SettingsNav = ({ activeSection, onSectionChange, isCaregiver }) => {
  // Settings navigation items
  const navItems = [
    {
      id: 'account',
      label: 'Account',
      icon: <FiUser className={styles.navIcon} />,
      roles: ['patient', 'caregiver']  // Available for all roles
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <FiBell className={styles.navIcon} />,
      roles: ['patient', 'caregiver']  // Available for all roles
    },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: <FiShield className={styles.navIcon} />,
      roles: ['patient', 'caregiver']  // Available for all roles
    },
    {
      id: 'caregiving',
      label: 'Caregiving',
      icon: <FiUsers className={styles.navIcon} />,
      roles: ['caregiver']  // Only available for caregivers
    }
  ];
  
  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => {
    // If user is caregiver, show caregiver-specific items
    if (isCaregiver) {
      return item.roles.includes('caregiver');
    }
    // Otherwise, only show patient items
    return item.roles.includes('patient') && !item.roles.includes('caregiver-only');
  });
  
  return (
    <div className={styles.settingsNav}>
      <ul className={styles.navList}>
        {filteredNavItems.map(item => (
          <li key={item.id}>
            <button
              className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
              onClick={() => onSectionChange(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsNav;