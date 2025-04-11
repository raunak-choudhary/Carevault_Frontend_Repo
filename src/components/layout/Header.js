import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiSun, FiMoon, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import styles from './Header.module.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    signOut();
    navigate('/login');
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
      <div className={styles.logo}>
        <div className={styles.logoImage}>
          <img src={require('../../assets/images/carevault-logo.png')} alt="CareVault" className={styles.logoImage} />
        </div>
        <span className={styles.logoText}>CareVault</span>
      </div>
      
      <div className={styles.headerRight}>
        <button 
          className={styles.themeToggle} 
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
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
                {user.firstName && user.lastName ? 
                  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'U'}
              </div>
              <span className={styles.userName}>
                {user.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
              </span>
              <FiChevronDown className={styles.dropdownIcon} />
            </button>
            
            {dropdownOpen && (
              <div className={styles.dropdown}>
                <Link to="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  <FiUser className={styles.dropdownIcon} />
                  <span>Profile</span>
                </Link>
                <Link to="/settings" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  <FiSettings className={styles.dropdownIcon} />
                  <span>Settings</span>
                </Link>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  <FiLogOut className={styles.dropdownIcon} />
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
    </header>
  );
};

export default Header;