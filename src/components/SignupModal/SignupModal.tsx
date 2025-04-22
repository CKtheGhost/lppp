'use client';

import { useState } from 'react';
import styles from './SignupModal.module.css';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SignupModal = ({ isOpen, onClose, onSuccess }: SignupModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Join PROSPERA Early Access</h2>
        <button onClick={onClose}>Close</button>
        <button onClick={onSuccess}>Submit</button>
      </div>
    </div>
  );
};

export default SignupModal;