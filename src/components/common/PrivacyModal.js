// PrivacyModal.js
import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import styles from './PrivacyModal.module.css';

const PrivacyModal = ({ isOpen, onClose }) => {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Privacy Policy</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <FiX size={24} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <h3>Last updated: May 5, 2025</h3>
          
          <section className={styles.section}>
            <h4>1. Introduction</h4>
            <p>CareVault ("we," "us," or "our") values your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal and health-related information when you use our full‑stack, mobile‑responsive healthcare management platform, in accordance with Human–Computer Interaction (HCI) principles and relevant regulations (e.g., HIPAA, GDPR). By accessing or using CareVault ("Service"), you consent to the practices described in this policy.</p>
          </section>
          
          <section className={styles.section}>
            <h4>2. Information We Collect</h4>
            <p>2.1. Account Information: Name, email, phone number, role (patient, caregiver, administrator).</p>
            <p>2.2. Health Data: Medical records, prescriptions, lab results, vital signs, and other health metrics you input or upload.</p>
            <p>2.3. Usage Data: IP address, device type, browser type, pages visited, interaction events (clicks, form submissions).</p>
            <p>2.4. Chat & AI Interactions: Transcripts of your conversations with our AI chatbot and any feedback you provide.</p>
            <p>2.5. Metadata & Logs: Timestamps, error logs, geolocation data (when explicitly permitted).</p>
          </section>
          
          <section className={styles.section}>
            <h4>3. How We Use Your Information</h4>
            <p>3.1. Service Provision: To authenticate users, manage profiles, schedule visits, send medication reminders, and power AI-driven insights.</p>
            <p>3.2. Improvement & Research: To analyze usage patterns, enhance usability (per HCI best practices), and improve feature accessibility and effectiveness.</p>
            <p>3.3. Communication: To send account alerts, notifications, updates, and marketing materials (with your consent).</p>
            <p>3.4. Security & Compliance: To detect and prevent fraud, enforce access controls, and comply with legal obligations (e.g., audit trails, HIPAA reporting).</p>
          </section>
          
          <section className={styles.section}>
            <h4>4. Data Sharing & Disclosure</h4>
            <p>4.1. With Service Providers: Cloud hosting, OCR processors, analytics, and email/SMS gateways—bound by confidentiality and security obligations.</p>
            <p>4.2. Healthcare Professionals: Only when you explicitly authorize sharing with a provider (e.g., telehealth integration).</p>
            <p>4.3. Legal Requirements: To comply with subpoenas, court orders, or legal investigations.</p>
            <p>4.4. Business Transfers: In the event of a merger, acquisition, or asset sale, with notice and choice for affected users.</p>
          </section>
          
          <section className={styles.section}>
            <h4>5. Cookies & Tracking Technologies</h4>
            <p>5.1. Cookies: We use essential cookies for authentication and session management, and performance cookies to improve site functionality.</p>
            <p>5.2. Web Analytics: Tools like Google Analytics collect anonymous usage metrics to optimize layout, navigation, and content clarity following HCI principles.</p>
            <p>5.3. Opt-Out: You can manage cookie preferences through your browser settings or our cookie consent banner.</p>
          </section>
          
          <section className={styles.section}>
            <h4>6. Data Security</h4>
            <p>6.1. Encryption: Data encrypted in transit (TLS) and at rest (AES‑256).</p>
            <p>6.2. Access Controls: Role-based permissions, strong password policies, multi-factor authentication options.</p>
            <p>6.3. Audit & Monitoring: Continuous logging, intrusion detection systems, and vulnerability assessments.</p>
          </section>
          
          <section className={styles.section}>
            <h4>7. User Rights & Control</h4>
            <p>7.1. Access & Portability: You can view and export your personal and health data via settings.</p>
            <p>7.2. Correction & Deletion: Users may correct inaccuracies or request deletion of their data, subject to retention requirements.</p>
            <p>7.3. Consent Management: You may withdraw consent for processing non-essential data at any time; core services may be impacted.</p>
          </section>
          
          <section className={styles.section}>
            <h4>8. Data Retention</h4>
            <p>We retain personal and health data for as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce our agreements. Retention periods align with regulatory requirements (e.g., HIPAA minimum retention of 6 years).</p>
          </section>
          
          <section className={styles.section}>
            <h4>9. Children's Privacy</h4>
            <p>CareVault is not intended for children under 18. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected such data, please contact us for prompt deletion.</p>
          </section>
          
          <section className={styles.section}>
            <h4>10. Third‑Party Services</h4>
            <p>Our Service may include links to external sites (e.g., payment gateways, map providers). We are not responsible for their privacy practices. Please review their policies before use.</p>
          </section>
          
          <section className={styles.section}>
            <h4>11. International Data Transfers</h4>
            <p>When transferring data outside your country, we implement Standard Contractual Clauses or rely on an adequacy decision to ensure continued protection.</p>
          </section>
          
          <section className={styles.section}>
            <h4>12. Changes to This Policy</h4>
            <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or in-app notification at least 30 days before they take effect. Continued use constitutes acceptance of the updated policy.</p>
          </section>
          
          <section className={styles.section}>
            <h4>13. Contact Us</h4>
            <p>For questions, requests, or concerns about your privacy, please contact:</p>
            <p>CareVault Privacy Officer<br />Email: privacy@carevault.health</p>
          </section>
          
          <section className={styles.section}>
            <h4>HCI Compliance Highlights</h4>
            <ul>
              <li>Transparency: Clear notices at data collection points and concise privacy summaries.</li>
              <li>Consent & Control: Interactive elements to manage preferences and opt‑in/out flows.</li>
              <li>Usability: Intuitive privacy settings and feedback mechanisms.</li>
              <li>Accessibility: Policy text designed for readability, WCAG 2.1 AA–compliant presentation.</li>
            </ul>
          </section>
          
          <p className={styles.conclusion}>Your trust is our priority. Thank you for choosing CareVault.</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.acceptButton} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;