// ProblemStatement.js
import React, { useRef, useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiHelpCircle,
  FiSearch,
  FiCheckCircle,
} from 'react-icons/fi';
import styles from './ProblemStatement.module.css';
// Import the logo
import carevaultLogo from '../../assets/images/carevault-logo.png';

const ProblemStatement = ({ problemData }) => {
  const [activeTab, setActiveTab] = useState('problem');
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const tabs = [
    { id: 'problem', label: 'Problem', icon: <FiAlertCircle /> },
    { id: 'subproblems', label: 'Sub-Problems', icon: <FiHelpCircle /> },
    { id: 'investigation', label: 'Investigation', icon: <FiSearch /> },
    { id: 'importance', label: 'Importance', icon: <FiCheckCircle /> },
  ];

  // Handle tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Setup intersection observer for animation
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const currentSectionRef = sectionRef.current;

    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  return (
    <div
      className={`${styles.problemStatement} ${isVisible ? styles.visible : ''}`}
      ref={sectionRef}
    >
      <div className={styles.problemTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => handleTabChange(tab.id)}
            role="tab"
            aria-controls={`${tab.id}-panel`}
            aria-selected={activeTab === tab.id ? 'true' : 'false'}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'problem' && (
          <div
            className={styles.tabPanel}
            id="problem-panel"
            role="tabpanel"
            aria-labelledby="problem-tab"
          >
            <h3 className={styles.tabTitle}>The Core Problem</h3>
            <p className={styles.mainProblem}>{problemData.mainProblem}</p>

            <div className={styles.impactList}>
              {problemData.impacts.map((impact, index) => (
                <div key={`impact-${index}`} className={styles.impactItem}>
                  <div className={styles.impactIcon}>
                    <FiAlertCircle />
                  </div>
                  <div className={styles.impactText}>{impact}</div>
                </div>
              ))}
            </div>

            <div className={styles.illustration}>
              <div className={styles.illustrationInner}>
                <div className={styles.persona}>
                  <div className={styles.personaAvatar}>👩‍⚕️</div>
                  <div className={styles.personaLabel}>Healthcare</div>
                </div>
                <div className={styles.connector}></div>
                <div className={styles.personaAction}>
                  <div className={styles.actionIcon}>🗂️</div>
                  <div className={styles.actionText}>Fragmented Management</div>
                </div>
                <div className={styles.connector}></div>
                <div className={styles.persona}>
                  <div className={styles.personaAvatar}>👨‍👩‍👧‍👦</div>
                  <div className={styles.personaLabel}>Patients/Caregivers</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subproblems' && (
          <div
            className={styles.tabPanel}
            id="subproblems-panel"
            role="tabpanel"
            aria-labelledby="subproblems-tab"
          >
            <h3 className={styles.tabTitle}>Sub-Problems</h3>

            <div className={styles.subproblemGrid}>
              {problemData.subProblems.map((subproblem, index) => (
                <div
                  key={`subproblem-${index}`}
                  className={styles.subproblemCard}
                >
                  <div className={styles.subproblemNumber}>{index + 1}</div>
                  <div className={styles.subproblemText}>{subproblem}</div>
                </div>
              ))}
            </div>

            <div className={styles.problemIllustration}>
              <div className={styles.fragmentedSystem}>
                <div className={styles.systemComponent}>
                  <div className={styles.componentIcon}>🏥</div>
                  <div className={styles.componentLabel}>Hospital Records</div>
                </div>
                <div className={styles.systemComponent}>
                  <div className={styles.componentIcon}>💊</div>
                  <div className={styles.componentLabel}>Prescriptions</div>
                </div>
                <div className={styles.systemComponent}>
                  <div className={styles.componentIcon}>🩺</div>
                  <div className={styles.componentLabel}>Test Results</div>
                </div>
                <div className={styles.systemComponent}>
                  <div className={styles.componentIcon}>📅</div>
                  <div className={styles.componentLabel}>Appointments</div>
                </div>
              </div>
              <div className={styles.versus}>VS</div>
              <div className={styles.integratedSystem}>
                <div className={styles.integratedIcon}>
                  <img
                    src={carevaultLogo}
                    alt="CareVault Logo"
                    className={styles.carevaultLogo}
                  />
                </div>
                <div className={styles.integratedLabel}>CareVault Solution</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investigation' && (
          <div
            className={styles.tabPanel}
            id="investigation-panel"
            role="tabpanel"
            aria-labelledby="investigation-tab"
          >
            <h3 className={styles.tabTitle}>Investigation Process</h3>

            <div className={styles.processList}>
              <div className={styles.processItem}>
                <div className={styles.processStep}>01</div>
                <div className={styles.processContent}>
                  <h4>Research Phase</h4>
                  <p>
                    Conducted thorough research on HCI solutions for the future
                    by reviewing numerous credible websites, reports, and
                    academic studies.
                  </p>
                </div>
              </div>

              <div className={styles.processItem}>
                <div className={styles.processStep}>02</div>
                <div className={styles.processContent}>
                  <h4>Gap Analysis</h4>
                  <p>
                    Identified a significant gap in the healthcare sector for
                    integrated digital management tools after evaluating
                    existing platforms and user experiences.
                  </p>
                </div>
              </div>

              <div className={styles.processItem}>
                <div className={styles.processStep}>03</div>
                <div className={styles.processContent}>
                  <h4>User Interviews</h4>
                  <p>
                    Conducted interviews with patients and caregivers to
                    understand pain points and challenges in healthcare
                    management.
                  </p>
                </div>
              </div>

              <div className={styles.processItem}>
                <div className={styles.processStep}>04</div>
                <div className={styles.processContent}>
                  <h4>Prototype Development</h4>
                  <p>
                    Created wireframes and prototypes to visualize the solution
                    and gathered feedback from potential users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'importance' && (
          <div
            className={styles.tabPanel}
            id="importance-panel"
            role="tabpanel"
            aria-labelledby="importance-tab"
          >
            <h3 className={styles.tabTitle}>Why It Matters</h3>

            <div className={styles.importanceWrapper}>
              <div className={styles.importanceContent}>
                <p className={styles.importanceIntro}>
                  Efficient healthcare management is vital to lower costs,
                  enhance quality of life, and support vulnerable populations
                  globally.
                </p>

                <ul className={styles.importanceList}>
                  {problemData.importance.map((item, index) => (
                    <li
                      key={`importance-${index}`}
                      className={styles.importanceItem}
                    >
                      <span className={styles.importanceCheck}>
                        <FiCheckCircle />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.importanceVisual}>
                <div className={styles.impactMetric}>
                  <div className={styles.metricValue}>
                    42<span>%</span>
                  </div>
                  <div className={styles.metricLabel}>
                    Reduction in medical errors with digital health management
                  </div>
                </div>

                <div className={styles.impactMetric}>
                  <div className={styles.metricValue}>
                    65<span>%</span>
                  </div>
                  <div className={styles.metricLabel}>
                    Caregivers report high stress from fragmented healthcare
                    systems
                  </div>
                </div>

                <div className={styles.impactMetric}>
                  <div className={styles.metricValue}>
                    3.8<span>hrs</span>
                  </div>
                  <div className={styles.metricLabel}>
                    Average time saved weekly with integrated healthcare tools
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemStatement;
