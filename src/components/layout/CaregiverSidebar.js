// CaregiverSidebar.js
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiMessageSquare,
  FiChevronRight,
  FiChevronDown,
  FiUser,
  FiBell,
  FiShield
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import styles from './CaregiverSidebar.module.css';

const CaregiverSidebar = ({ isOpen, onClose }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();
  const { user } = useAuth();
  
  // Combine classes for mobile responsiveness
  const sidebarClasses = `${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`;
  
  // Determine if currently viewing a patient context
  const isPatientContext = location.pathname.includes('/patient/');
  
  const navItems = [
    { to: "/dashboard", icon: <FiHome className={styles.navIcon} />, label: "Dashboard" },
    { to: "/patients", icon: <FiUsers className={styles.navIcon} />, label: "My Patients" },
    { to: "/chat", icon: <FiMessageSquare className={styles.navIcon} />, label: "Assistance" },
    { 
      to: "/settings", 
      icon: <FiSettings className={styles.navIcon} />, 
      label: "Settings",
      subItems: [
        { to: "/settings", label: "Account", icon: <FiUser size={14} /> },
        { to: "/settings?section=notifications", label: "Notifications", icon: <FiBell size={14} /> },
        { to: "/settings?section=privacy", label: "Privacy", icon: <FiShield size={14} /> },
        { to: "/settings?section=caregiving", label: "Caregiving", icon: <FiUsers size={14} /> }
      ]
    }
  ];

  // Function to check if a route is active
  const isRouteActive = (path) => {
    // For settings with query params, special handling
    if (path.includes('?section=')) {
      const [pathname, query] = path.split('?');
      const section = query.split('=')[1];
      const currentSection = new URLSearchParams(location.search).get('section') || 'account';
      
      return location.pathname === pathname && currentSection === section;
    }
    
    // Special case for patients section - always highlight when in patient context
    if (path === '/patients' && isPatientContext) {
      return true;
    }
    
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Function to toggle expanded state of navigation items
  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Check if an item should show expanded (if current route matches or item is manually expanded)
  const shouldExpand = (index, item) => {
    // Auto-expand if current route matches any of the subitems
    const isActive = item.subItems && item.subItems.some(
      subItem => location.pathname === subItem.to || location.pathname.startsWith(subItem.to.split('?')[0])
    );
    
    // Auto-expand settings when on settings page
    if (item.to === '/settings' && location.pathname === '/settings') {
      return true;
    }
    
    // Return true if either manually expanded or route is active
    return expandedItems[index] || isActive;
  };

  return (
    <>
      {/* Overlay for mobile - only visible when sidebar is open */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      
      <aside className={sidebarClasses}>
        <div className={styles.sidebarHeader}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.firstName} {user?.lastName}</div>
              <div className={styles.userRole}>Caregiver</div>
            </div>
          </div>
        </div>
        
        <nav className={styles.nav}>
          {navItems.map((item, index) => (
            <div key={index} className={styles.navItemContainer}>
              {item.subItems && item.subItems.length > 0 ? (
                // If item has subitems, make the main item a button that toggles expansion
                <button 
                  className={`${styles.navItem} ${isRouteActive(item.to) ? styles.navItemActive : ''}`}
                  onClick={() => toggleExpand(index)}
                >
                  {item.icon}
                  <span className={styles.navLabel}>{item.label}</span>
                  <span className={styles.expandIcon}>
                    {shouldExpand(index, item) ? <FiChevronDown /> : <FiChevronRight />}
                  </span>
                </button>
              ) : (
                // Regular nav link for items without subitems
                <NavLink 
                  to={item.to} 
                  className={({ isActive }) => 
                    isActive || isRouteActive(item.to) ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                  }
                  onClick={onClose}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              )}
              
              {/* Render subitems if any and if expanded */}
              {item.subItems && item.subItems.length > 0 && shouldExpand(index, item) && (
                <div className={styles.subItems}>
                  {item.subItems.map((subItem, subIndex) => (
                    <NavLink
                      key={`${index}-${subIndex}`}
                      to={subItem.to}
                      className={({ isActive }) => {
                        // Special case for settings with query params
                        if (subItem.to.includes('?section=')) {
                          const section = subItem.to.split('?section=')[1];
                          const currentSection = new URLSearchParams(location.search).get('section') || 'account';
                          return location.pathname === '/settings' && currentSection === section
                            ? `${styles.subItem} ${styles.subItemActive}`
                            : styles.subItem;
                        }
                        
                        return isActive || location.pathname.startsWith(subItem.to) 
                          ? `${styles.subItem} ${styles.subItemActive}` 
                          : styles.subItem;
                      }}
                      onClick={onClose}
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

export default CaregiverSidebar;