import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiFileText, FiMessageSquare, FiCalendar, FiPieChart } from 'react-icons/fi';
import styles from './MobileNavigation.module.css';

const MobileNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { to: "/dashboard", icon: <FiHome className={styles.navIcon} />, label: "Home" },
    { to: "/documents", icon: <FiFileText className={styles.navIcon} />, label: "Docs" },
    { to: "/chat", icon: <FiMessageSquare className={styles.navIcon} />, label: "Assistant" },
    { to: "/appointments", icon: <FiCalendar className={styles.navIcon} />, label: "Appointments" }, // Updated label
    { to: "/insights", icon: <FiPieChart className={styles.navIcon} />, label: "Insights" }
  ];

  // Helper function to check if a route starts with a certain path
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
              return isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem;
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

export default MobileNavigation;