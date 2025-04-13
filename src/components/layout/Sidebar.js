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
  FiChevronRight
} from 'react-icons/fi';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, onClose }) => {
  // State to track which categories are expanded
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();
  
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
    { 
      to: "/insights", 
      icon: <FiPieChart className={styles.navIcon} />, 
      label: "Health Insights",
      subItems: [
        { to: "/insights", label: "Dashboard", icon: <FiActivity size={14} /> },
        { to: "/insights/metric/weight", label: "Weight", icon: <FiTrendingUp size={14} /> },
        { to: "/insights/metric/bloodPressure", label: "Blood Pressure", icon: <FiActivity size={14} /> },
        { to: "/insights/metric/bloodGlucose", label: "Blood Glucose", icon: <FiActivity size={14} /> },
        { to: "/insights/metric/heartRate", label: "Heart Rate", icon: <FiHeart size={14} /> },
        { to: "/insights/metric/sleep", label: "Sleep", icon: <FiActivity size={14} /> },
        { to: "/insights/metric/steps", label: "Steps", icon: <FiActivity size={14} /> },
        { to: "/insights/input", label: "Add Health Data", icon: <FiPlus size={14} /> }
      ]
    },
    { to: "/settings", icon: <FiSettings className={styles.navIcon} />, label: "Settings" }
  ];

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
      subItem => location.pathname === subItem.to || location.pathname.startsWith(subItem.to)
    );
    
    // Return true if either manually expanded or route is active
    return expandedItems[index] || isActive;
  };

  return (
    <>
      {/* Overlay for mobile - only visible when sidebar is open */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      
      <aside className={sidebarClasses}>
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