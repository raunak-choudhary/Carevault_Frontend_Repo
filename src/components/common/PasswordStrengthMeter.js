import React from 'react';
import styles from './PasswordStrengthMeter.module.css';

// Function to calculate password strength
const calculateStrength = (password) => {
  if (!password) return 0;

  // Basic criteria for password strength
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const isLongEnough = password.length >= 8;

  // Calculate score based on criteria met
  let score = 0;
  if (hasLowerCase) score += 1;
  if (hasUpperCase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecialChar) score += 1;
  if (isLongEnough) score += 1;

  return Math.min(score, 4); // Max score is 4
};

// Function to get strength label and color
const getStrengthInfo = (score) => {
  switch (score) {
    case 0:
      return { label: 'Very Weak', color: 'red' };
    case 1:
      return { label: 'Weak', color: 'orange' };
    case 2:
      return { label: 'Fair', color: 'yellow' };
    case 3:
      return { label: 'Good', color: 'lightgreen' };
    case 4:
      return { label: 'Strong', color: 'green' };
    default:
      return { label: '', color: 'transparent' };
  }
};

const PasswordStrengthMeter = ({ password }) => {
  const strength = calculateStrength(password);
  const { label, color } = getStrengthInfo(strength);

  // Calculate the width for each segment
  const segmentWidth = `${25 * strength}%`;

  return (
    <div className={styles.passwordStrengthMeter}>
      <div className={styles.strengthBar}>
        <div
          className={styles.strengthSegment}
          style={{ width: segmentWidth, backgroundColor: color }}
        ></div>
      </div>
      {password && (
        <div className={styles.strengthLabel}>
          Password Strength: <span style={{ color }}>{label}</span>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
