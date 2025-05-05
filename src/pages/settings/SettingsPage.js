import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SettingsNav from '../../components/settings/SettingsNav';
import styles from './SettingsPage.module.css';

const SettingsPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract section from URL query parameters - wrapped in useCallback
  const getInitialSection = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('section') || 'account';
  }, [location.search]);

  const [activeSection, setActiveSection] = useState(getInitialSection);

  // Update URL when section changes
  useEffect(() => {
    if (activeSection === 'account') {
      navigate('/settings', { replace: true });
    } else {
      navigate(`/settings?section=${activeSection}`, { replace: true });
    }
  }, [activeSection, navigate]);

  // Update section when URL changes
  useEffect(() => {
    const section = getInitialSection();
    setActiveSection(section);
  }, [getInitialSection]);

  // Determine if user is a caregiver
  const isCaregiver = user && user.role === 'caregiver';

  // Handle section change from SettingsNav
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Render appropriate settings section based on activeSection
  const renderSettingsSection = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className={styles.settingsSection}>
            <h2>Account Settings</h2>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                defaultValue={`${user?.firstName || ''} ${user?.lastName || ''}`}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" defaultValue={user?.email || ''} />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input type="tel" defaultValue={user?.phone || ''} />
            </div>

            <h3>Password</h3>
            <div className={styles.formGroup}>
              <label>Current Password</label>
              <input type="password" />
            </div>
            <div className={styles.formGroup}>
              <label>New Password</label>
              <input type="password" />
            </div>
            <div className={styles.formGroup}>
              <label>Confirm New Password</label>
              <input type="password" />
            </div>

            <button className={styles.saveButton}>Save Changes</button>
          </div>
        );

      case 'notifications':
        return (
          <div className={styles.settingsSection}>
            <h2>Notification Settings</h2>

            <div className={styles.toggleGroup}>
              <div className={styles.toggle}>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
                <div className={styles.toggleLabel}>
                  <h4>Email Notifications</h4>
                  <p>
                    Receive email updates about appointments, medications, and
                    documents
                  </p>
                </div>
              </div>

              <div className={styles.toggle}>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
                <div className={styles.toggleLabel}>
                  <h4>In-App Notifications</h4>
                  <p>Receive notifications within the application</p>
                </div>
              </div>

              <div className={styles.toggle}>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
                <div className={styles.toggleLabel}>
                  <h4>Medication Reminders</h4>
                  <p>Receive notifications for medication schedules</p>
                </div>
              </div>

              <div className={styles.toggle}>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
                <div className={styles.toggleLabel}>
                  <h4>Appointment Reminders</h4>
                  <p>Receive reminders for upcoming appointments</p>
                </div>
              </div>
            </div>

            <button className={styles.saveButton}>Save Changes</button>
          </div>
        );

      case 'privacy':
        return (
          <div className={styles.settingsSection}>
            <h2>Privacy Settings</h2>

            <div className={styles.toggleGroup}>
              <div className={styles.toggle}>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
                <div className={styles.toggleLabel}>
                  <h4>Share Health Data with Caregivers</h4>
                  <p>Allow your caregivers to view your health data</p>
                </div>
              </div>

              <div className={styles.toggle}>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
                <div className={styles.toggleLabel}>
                  <h4>Share Documents with Caregivers</h4>
                  <p>Allow your caregivers to view your documents</p>
                </div>
              </div>
            </div>

            <button className={styles.saveButton}>Save Changes</button>
          </div>
        );

      case 'caregiving':
        // Only show for caregivers
        if (!isCaregiver) return <div>Not authorized</div>;

        return (
          <div className={styles.settingsSection}>
            <h2>Caregiving Settings</h2>

            <div className={styles.formGroup}>
              <label>Default View</label>
              <select defaultValue="list">
                <option value="list">Patients List</option>
                <option value="dashboard">Dashboard</option>
              </select>
              <p className={styles.hint}>
                Choose the default view when logging in
              </p>
            </div>

            <div className={styles.toggleGroup}>
              <div className={styles.toggle}>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
                <div className={styles.toggleLabel}>
                  <h4>Critical Alerts</h4>
                  <p>Receive urgent notifications about your patients</p>
                </div>
              </div>

              <div className={styles.toggle}>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </label>
                <div className={styles.toggleLabel}>
                  <h4>Patient Status Updates</h4>
                  <p>Receive regular updates on patient status changes</p>
                </div>
              </div>
            </div>

            <button className={styles.saveButton}>Save Changes</button>
          </div>
        );

      default:
        return <div>Select a settings category</div>;
    }
  };

  return (
    <div className={styles.settingsPage}>
      <h1>Settings</h1>

      <div className={styles.settingsContainer}>
        <SettingsNav
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isCaregiver={isCaregiver}
        />
        <div className={styles.settingsContent}>{renderSettingsSection()}</div>
      </div>
    </div>
  );
};

export default SettingsPage;
