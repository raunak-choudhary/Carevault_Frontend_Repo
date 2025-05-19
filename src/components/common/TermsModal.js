import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import styles from './TermsModal.module.css';

const TermsModal = ({ isOpen, onClose }) => {
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
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Terms and Conditions</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <h3>Last updated: May 5, 2025</h3>

          <section className={styles.section}>
            <h4>1. Introduction</h4>
            <p>
              Welcome to CareVault, a full‑stack, mobile‑responsive healthcare
              management platform designed with user‑centered principles of
              Human-Computer Interaction (HCI). These Terms and Conditions
              ("Terms") govern your access to and use of CareVault's website,
              mobile applications, APIs, and related services (collectively, the
              "Service"). By accessing or using the Service, you agree to comply
              with and be bound by these Terms.
            </p>
          </section>

          <section className={styles.section}>
            <h4>2. Acceptance of Terms</h4>
            <p>
              2.1. Eligibility: You must be at least 18 years old and capable of
              forming a binding contract.
            </p>
            <p>
              2.2. Agreement: If you are using CareVault on behalf of an
              organization, you represent that you have authority to bind that
              organization to these Terms.
            </p>
          </section>

          <section className={styles.section}>
            <h4>3. User Accounts and Authentication</h4>
            <p>
              3.1. Registration: You agree to provide accurate, complete, and
              current information when creating an account.
            </p>
            <p>
              3.2. Security: You are responsible for maintaining the
              confidentiality of your login credentials. Notify us immediately
              of any unauthorized use.
            </p>
            <p>
              3.3. Role‑Based Access: CareVault implements patient, caregiver,
              and administrative roles. You must not share credentials across
              roles or accounts.
            </p>
          </section>

          <section className={styles.section}>
            <h4>4. Use of the Service</h4>
            <p>
              4.1. Permitted Use: You may use the Service only for lawful
              healthcare management purposes and in compliance with applicable
              regulations (e.g., HIPAA).
            </p>
            <p>
              4.2. Prohibited Conduct: You agree not to (a) reverse engineer or
              decompile software, (b) transmit harmful code or malware, (c)
              misuse AI features to generate misleading or unauthorized content,
              or (d) circumvent any security or access controls.
            </p>
          </section>

          <section className={styles.section}>
            <h4>5. Privacy, Data Protection, and HCI Principles</h4>
            <p>
              5.1. Data Collection: We collect personal and health‑related
              information necessary to provide the Service and improve usability
              and accessibility.
            </p>
            <p>
              5.2. Consent & Transparency: In alignment with HCI principles, we
              provide clear notices and obtain user consent before collecting or
              processing sensitive data.
            </p>
            <p>
              5.3. Data Security: We apply role‑based access controls,
              encryption at rest and in transit, and audit trails to protect
              your data.
            </p>
            <p>
              5.4. User Control: Users may view, correct, export, or delete
              their personal data via settings.
            </p>
            <p>
              5.5. Accessibility & Usability: We design features following WCAG
              2.1 AA guidelines and HCI best practices, ensuring clear feedback,
              error prevention, and intuitive navigation.
            </p>
          </section>

          <section className={styles.section}>
            <h4>6. Intellectual Property</h4>
            <p>
              6.1. Ownership: CareVault and its licensors retain all rights,
              title, and interest in the Service, including all source code,
              designs, graphics, and documentation.
            </p>
            <p>
              6.2. License: Subject to your compliance with these Terms,
              CareVault grants you a limited, non‑exclusive, non‑transferable
              license to access and use the Service.
            </p>
            <p>
              6.3. User Content: You retain ownership of content you upload
              (e.g., documents, images). By uploading, you grant CareVault a
              license to store, display, and process that content to provide the
              Service.
            </p>
          </section>

          <section className={styles.section}>
            <h4>7. AI and Automated Features</h4>
            <p>
              7.1. RAG & Chatbot: CareVault's AI uses Retrieval-Augmented
              Generation. You accept that AI suggestions may be approximate and
              should be verified before clinical use.
            </p>
            <p>
              7.2. Feedback Loop: To improve HCI effectiveness, user feedback on
              AI responses may be collected and anonymized for training.
            </p>
          </section>

          <section className={styles.section}>
            <h4>8. Disclaimers and Warranties</h4>
            <p>
              8.1. As‑Is Basis: The Service is provided "as is" without
              warranties of any kind.
            </p>
            <p>
              8.2. No Medical Advice: Content generated by the Service,
              including AI chat responses, does not constitute medical advice.
              Always consult a qualified healthcare professional.
            </p>
          </section>

          <section className={styles.section}>
            <h4>9. Limitation of Liability</h4>
            <p>
              To the fullest extent permitted by law, CareVault and its
              affiliates are not liable for any indirect, consequential,
              special, or punitive damages arising out of or related to your use
              of the Service, even if advised of the possibility of such
              damages.
            </p>
          </section>

          <section className={styles.section}>
            <h4>10. Indemnification</h4>
            <p>
              You agree to indemnify and hold harmless CareVault, its
              affiliates, and licensors from any claim, loss, liability, or
              demand arising from your violation of these Terms or misuse of the
              Service.
            </p>
          </section>

          <section className={styles.section}>
            <h4>11. Termination</h4>
            <p>
              11.1. By You: You may delete your account at any time via the user
              settings page.
            </p>
            <p>
              11.2. By Us: We may suspend or terminate your access for
              violations, at our discretion, with or without notice.
            </p>
          </section>

          <section className={styles.section}>
            <h4>12. Changes to Terms</h4>
            <p>
              We may update these Terms periodically. We will provide notice via
              email or in‑app notification at least 30 days before material
              changes take effect. Continued use of the Service constitutes
              acceptance of the updated Terms.
            </p>
          </section>

          <section className={styles.section}>
            <h4>13. Governing Law</h4>
            <p>
              These Terms are governed by the laws of the State of New York,
              without regard to conflict of law principles. Any dispute shall be
              resolved in the state or federal courts located in New York
              County.
            </p>
          </section>

          <section className={styles.section}>
            <h4>14. Contact Us</h4>
            <p>
              If you have questions or concerns about these Terms, please
              contact us at:
            </p>
            <p>
              CareVault Support
              <br />
              Email: support@carevault.health
            </p>
          </section>

          <section className={styles.section}>
            <h4>Human-Computer Interaction Compliance Notes</h4>
            <ul>
              <li>
                Usability: Interfaces follow consistent layouts, clear
                affordances, and immediate feedback for all actions.
              </li>
              <li>
                Accessibility: All components meet WCAG 2.1 Level AA; ARIA roles
                implemented in dynamic content.
              </li>
              <li>
                Error Prevention: Form validations, confirmation dialogs, and
                undo options are provided.
              </li>
              <li>
                Learnability: Progressive disclosure and guided onboarding
                ensure new users adapt quickly.
              </li>
              <li>
                User Autonomy: Settings allow customization of notifications,
                themes (light/dark), and data export.
              </li>
            </ul>
          </section>

          <p className={styles.conclusion}>
            Thank you for choosing CareVault. Your trust and privacy are our top
            priorities.
          </p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.acceptButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
