// BreadcrumbNavigation.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiUsers } from 'react-icons/fi';
import { usePatients } from '../../hooks/usePatients';
import { useAuth } from '../../hooks/useAuth';
import styles from './BreadcrumbNavigation.module.css';

const BreadcrumbNavigation = () => {
  const location = useLocation();
  const { activePatient } = usePatients();
  const { isCaregiver } = useAuth();

  // Map routes to readable names
  const routeNames = {
    dashboard: 'Dashboard',
    documents: 'Documents',
    chat: 'Assistant',
    appointments: 'Appointments',
    insights: 'Health Insights',
    medications: 'Medications',
    settings: 'Settings',
    profile: 'Profile',
    patients: 'Patients',
    view: 'View',
    upload: 'Upload',
    create: 'Create',
    edit: 'Edit',
    metric: 'Metric',
    input: 'Add Data',
    providers: 'Providers',
    add: 'Add',
  };

  // Split the path into segments, removing empty segments
  const pathSegments = location.pathname
    .split('/')
    .filter((segment) => segment);

  // Generate breadcrumb items
  const generateBreadcrumbs = () => {
    let breadcrumbs = [];
    let currentPath = '';

    // Don't show breadcrumbs on the patients list page for caregivers
    if (
      isCaregiver() &&
      pathSegments.length === 1 &&
      pathSegments[0] === 'patients'
    ) {
      return [];
    }

    // Always start with My Patients for caregivers
    if (isCaregiver()) {
      breadcrumbs.push({
        name: 'My Patients',
        path: '/patients',
        icon: <FiUsers />,
        isHome: true,
      });
    }

    // Add active patient if present
    if (activePatient) {
      breadcrumbs.push({
        name: `${activePatient.firstName} ${activePatient.lastName}`,
        path: `/patient/${activePatient.id}/dashboard`,
        isPatient: true,
      });
    }

    // Add path segments
    pathSegments.forEach((segment, index) => {
      // Skip adding dashboard again if it's already added as home
      if (index === 0 && segment === 'dashboard') {
        return;
      }

      // Skip adding patients again if it's already added
      if (index === 0 && segment === 'patients' && isCaregiver()) {
        return;
      }

      // Handle patient ID in URL
      if (segment === 'patient' && index + 1 < pathSegments.length) {
        // Skip the patient ID segment as we've added the patient name already
        return;
      }

      // Skip patient ID
      if (index > 0 && pathSegments[index - 1] === 'patient') {
        return;
      }

      // Skip 'view', 'edit', etc. as standalone items
      if (
        ['view', 'edit', 'create', 'metric'].includes(segment) &&
        index < pathSegments.length - 1
      ) {
        return;
      }

      // Skip likely IDs (assume numeric or alphanumeric with hyphens)
      if (
        /^[a-zA-Z0-9-]+$/.test(segment) &&
        segment.length > 8 &&
        isNaN(Number(segment))
      ) {
        return;
      }

      currentPath += `/${segment}`;

      breadcrumbs.push({
        name:
          routeNames[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath,
        isCurrent: index === pathSegments.length - 1,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null; // Don't show breadcrumbs if empty
  }

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbsList}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className={styles.breadcrumbItem}>
            {breadcrumb.isCurrent ? (
              <span className={styles.currentPage}>
                {breadcrumb.icon && (
                  <span className={styles.icon}>{breadcrumb.icon}</span>
                )}
                {breadcrumb.name}
              </span>
            ) : (
              <>
                <Link
                  to={breadcrumb.path}
                  className={
                    breadcrumb.isPatient
                      ? styles.patientLink
                      : breadcrumb.isHome
                        ? styles.homeLink
                        : ''
                  }
                >
                  {breadcrumb.icon && (
                    <span className={styles.icon}>{breadcrumb.icon}</span>
                  )}
                  {breadcrumb.name}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <span className={styles.separator}>
                    <FiChevronRight aria-hidden="true" />
                  </span>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;
