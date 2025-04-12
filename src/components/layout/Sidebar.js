import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiFileText, 
  FiMessageSquare, 
  FiCalendar, 
  FiPieChart, 
  FiSettings, 
  FiUpload,
  FiPlus,
  FiSearch
} from 'react-icons/fi';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, onClose }) => {
  // Combine classes for mobile responsiveness
  const sidebarClasses = `${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`;
  
  const navItems = [
    { to: "/dashboard", icon: <FiHome className={styles.navIcon} />, label: "Dashboard" },
    { 
      to: "/documents", 
      icon: <FiFileText className={styles.navIcon} />, 
      label: "Documents",
      subItems: [
        { to: "/documents", label: "All Documents" },
        { to: "/documents/upload", label: "Upload New", icon: <FiUpload size={14} /> }
      ]
    },
    { 
      to: "/chat", 
      icon: <FiMessageSquare className={styles.navIcon} />, 
      label: "Chat Assistant"
    },
    // Updated Appointments nav item with subitems
    { 
      to: "/appointments", 
      icon: <FiCalendar className={styles.navIcon} />, 
      label: "Appointments",
      subItems: [
        { to: "/appointments", label: "My Appointments" },
        { to: "/appointments/create", label: "Schedule New", icon: <FiPlus size={14} /> },
        { to: "/appointments/providers", label: "Find Providers", icon: <FiSearch size={14} /> }
      ]
    },
    { to: "/insights", icon: <FiPieChart className={styles.navIcon} />, label: "Health Insights" },
    { to: "/settings", icon: <FiSettings className={styles.navIcon} />, label: "Settings" }
  ];

  // Function to check if a route is active, including partial matches for subitems
  const isRouteActive = (path) => {
    return window.location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay for mobile - only visible when sidebar is open */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      
      <aside className={sidebarClasses}>
        <nav className={styles.nav}>
          {navItems.map((item, index) => (
            <div key={index} className={styles.navItemContainer}>
              <NavLink 
                to={item.to} 
                className={({ isActive }) => 
                  isActive || (item.subItems && isRouteActive(item.to)) 
                    ? `${styles.navItem} ${styles.navItemActive}` 
                    : styles.navItem
                }
                end={item.subItems ? true : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
              
              {/* Render subitems if any */}
              {item.subItems && (
                <div className={styles.subItems}>
                  {item.subItems.map((subItem, subIndex) => (
                    <NavLink
                      key={`${index}-${subIndex}`}
                      to={subItem.to}
                      className={({ isActive }) => 
                        isActive ? `${styles.subItem} ${styles.subItemActive}` : styles.subItem
                      }
                    >
                      {subItem.icon && <span className={styles.subItemIcon}>{subItem.icon}</span>}
                      <span>{subItem.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;