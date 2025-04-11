import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import styles from './BaseLayout.module.css';

const BaseLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={styles.layout}>
      <Header />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <main className={styles.main}>
        {children}
      </main>
      
      <MobileNavigation />
      
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