import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiFileText, 
  FiMessageSquare, 
  FiCalendar, 
  FiPieChart, 
  FiSettings, 
  FiUpload,
  FiPlus,
  FiSearch,
  FiActivity,
  FiHeart,
  FiTrendingUp,
  FiChevronDown,
  FiChevronRight,
  FiPackage,
  FiBell,
  FiUser,
  FiShield,
  FiGrid
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { usePatients } from '../../hooks/usePatients';
import ContextIndicator from '../navigation/ContextIndicator';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, onClose }) => {
  // State to track which categories are expanded
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  const { isCaregiver } = useAuth();
  const { activePatient, isViewingPatient } = usePatients();
  
  // Combine classes for mobile responsiveness
  const sidebarClasses = `${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`;
  
  // Create base URL for paths based on whether we're viewing a patient or not
  const getBaseUrl = () => {
    return isViewingPatient && activePatient ? `/patient/${activePatient.id}` : '';
  };
  
  // Patient navigation items - dynamically create paths based on context
  const getPatientNavItems = () => {
    const baseUrl = getBaseUrl();
    
    return [
      { to: `${baseUrl}/dashboard`, icon: <FiHome className={styles.navIcon} />, label: "Dashboard" },
      { 
        to: `${baseUrl}/documents`, 
        icon: <FiFileText className={styles.navIcon} />, 
        label: "Documents",
        subItems: [
          { to: `${baseUrl}/documents`, label: "All Documents" },
          { to: `${baseUrl}/documents/upload`, label: "Upload New", icon: <FiUpload size={14} /> }
        ]
      },
      { 
        to: `${baseUrl}/chat`, 
        icon: <FiMessageSquare className={styles.navIcon} />, 
        label: "Chat Assistant"
      },
      { 
        to: `${baseUrl}/appointments`, 
        icon: <FiCalendar className={styles.navIcon} />, 
        label: "Appointments",
        subItems: [
          { to: `${baseUrl}/appointments`, label: "My Appointments" },
          { to: `${baseUrl}/appointments/create`, label: "Schedule New", icon: <FiPlus size={14} /> },
          { to: `${baseUrl}/appointments/providers`, label: "Find Providers", icon: <FiSearch size={14} /> }
        ]
      },
      {
        to: `${baseUrl}/medications`,
        icon: <FiPackage className={styles.navIcon} />,
        label: "Medications",
        subItems: [
          { to: `${baseUrl}/medications`, label: "My Medications" },
          { to: `${baseUrl}/medications/add`, label: "Add Medication", icon: <FiPlus size={14} /> },
          { to: `${baseUrl}/medications/reminders`, label: "Reminders", icon: <FiBell size={14} /> }
        ]
      },
      { 
        to: `${baseUrl}/insights`, 
        icon: <FiPieChart className={styles.navIcon} />, 
        label: "Health Insights",
        subItems: [
          { to: `${baseUrl}/insights`, label: "Dashboard", icon: <FiActivity size={14} /> },
          { to: `${baseUrl}/insights/metric/weight`, label: "Weight", icon: <FiTrendingUp size={14} /> },
          { to: `${baseUrl}/insights/metric/bloodPressure`, label: "Blood Pressure", icon: <FiActivity size={14} /> },
          { to: `${baseUrl}/insights/metric/bloodGlucose`, label: "Blood Glucose", icon: <FiActivity size={14} /> },
          { to: `${baseUrl}/insights/metric/heartRate`, label: "Heart Rate", icon: <FiHeart size={14} /> },
          { to: `${baseUrl}/insights/metric/sleep`, label: "Sleep", icon: <FiActivity size={14} /> },
          { to: `${baseUrl}/insights/metric/steps`, label: "Steps", icon: <FiActivity size={14} /> },
          { to: `${baseUrl}/insights/input`, label: "Add Health Data", icon: <FiPlus size={14} /> }
        ]
      },
      { 
        to: "/settings", 
        icon: <FiSettings className={styles.navIcon} />, 
        label: "Settings",
        subItems: [
          { to: "/settings", label: "Account", icon: <FiUser size={14} /> },
          { to: "/settings?section=notifications", label: "Notifications", icon: <FiBell size={14} /> },
          { to: "/settings?section=privacy", label: "Privacy", icon: <FiShield size={14} /> }
        ]
      }
    ];
  };
  
  // Caregiver navigation items
  const caregiverNavItems = [
    { to: "/dashboard", icon: <FiHome className={styles.navIcon} />, label: "Dashboard" },
    { to: "/patients", icon: <FiUser className={styles.navIcon} />, label: "Patients" },
    { to: "/chat", icon: <FiMessageSquare className={styles.navIcon} />, label: "Chat Assistant" },
    { 
      to: "/settings", 
      icon: <FiSettings className={styles.navIcon} />, 
      label: "Settings",
      subItems: [
        { to: "/settings", label: "Account", icon: <FiUser size={14} /> },
        { to: "/settings?section=notifications", label: "Notifications", icon: <FiBell size={14} /> },
        { to: "/settings?section=privacy", label: "Privacy", icon: <FiShield size={14} /> },
        { to: "/settings?section=caregiving", label: "Caregiving", icon: <FiUser size={14} /> }
      ]
    }
  ];
  
  // Choose appropriate nav items based on role and current state
  const navItems = isCaregiver() && !isViewingPatient ? caregiverNavItems : getPatientNavItems();

  // Function to check if a route is active, including partial matches for subitems
  const isRouteActive = (path) => {
    return location.pathname.startsWith(path);
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
        <div className={styles.contextIndicatorContainer}>
          <ContextIndicator />
        </div>
        
        {/* Only render the caregiver action if actively viewing a patient */}
        {isCaregiver() && isViewingPatient && (
          <div className={styles.caregiverAction}>
            <NavLink 
              to="/dashboard" 
              className={styles.caregiverHomeLink}
              onClick={onClose}
            >
              <FiGrid className={styles.caregiverHomeIcon} />
              <span>Caregiver Dashboard</span>
            </NavLink>
          </div>
        )}
        
        <nav className={styles.nav}>
          {navItems.map((item, index) => (
            <div key={index} className={styles.navItemContainer}>
              {item.subItems ? (
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
                    isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                  }
                  onClick={onClose}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              )}
              
              {/* Render subitems if any and if expanded */}
              {item.subItems && shouldExpand(index, item) && (
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
                        return isActive ? `${styles.subItem} ${styles.subItemActive}` : styles.subItem;
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

export default Sidebar;