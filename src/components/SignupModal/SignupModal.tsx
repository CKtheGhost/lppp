'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './SignupModal.module.css';
import { trackEvent } from '@/utils/analyticsUtils';
import { submitRegistration } from '@/utils/apiUtils';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type FormField = {
  value: string;
  error: string;
  touched: boolean;
};

type SignupForm = {
  fullName: FormField;
  email: FormField;
  phone: FormField;
  country: FormField;
  investmentLevel: FormField;
  experience: FormField;
  referralCode: FormField;
  agreeTerms: FormField;
  agreeUpdates: FormField;
};

type WalletForm = {
  walletAddress: FormField;
  network: FormField;
  agreeTerms: FormField;
};

const initialSignupForm: SignupForm = {
  fullName: { value: '', error: '', touched: false },
  email: { value: '', error: '', touched: false },
  phone: { value: '', error: '', touched: false },
  country: { value: '', error: '', touched: false },
  investmentLevel: { value: '', error: '', touched: false },
  experience: { value: '', error: '', touched: false },
  referralCode: { value: '', error: '', touched: false },
  agreeTerms: { value: 'false', error: '', touched: false },
  agreeUpdates: { value: 'false', error: '', touched: false },
};

const initialWalletForm: WalletForm = {
  walletAddress: { value: '', error: '', touched: false },
  network: { value: '', error: '', touched: false },
  agreeTerms: { value: 'false', error: '', touched: false },
};

// Countries list for dropdown
const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", 
  "Japan", "Singapore", "South Korea", "Switzerland", "Netherlands", 
  "New Zealand", "Sweden", "Norway", "Finland", "Denmark", "Italy", "Spain"
];

// Investment levels
const investmentLevels = [
  "Tier 1: $1,000 - $10,000",
  "Tier 2: $10,001 - $50,000",
  "Tier 3: $50,001 - $100,000",
  "Tier 4: $100,001+"
];

// Experience levels
const experienceLevels = [
  "Beginner - New to crypto & investments",
  "Intermediate - Some experience with crypto",
  "Advanced - Experienced crypto investor",
  "Professional - Financial industry background"
];

// Blockchain networks
const networks = ["Ethereum", "Solana", "Binance Smart Chain", "Polygon", "Avalanche"];

const SignupModal = ({ isOpen, onClose, onSuccess }: SignupModalProps) => {
  const [activeTab, setActiveTab] = useState('email');
  const [signupForm, setSignupForm] = useState<SignupForm>(initialSignupForm);
  const [walletForm, setWalletForm] = useState<WalletForm>(initialWalletForm);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Manage focus when modal opens
  useEffect(() => {
    const closeButton = document.querySelector(`.${styles.closeButton}`) as HTMLElement;
    
    if (isOpen && closeButton) {
      setTimeout(() => {
        closeButton.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Trap focus within modal
  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleTabKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);
  
  // Animation transitions
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen) {
      // Set overlay visible first, then animate modal
      setModalActive(true);
      timer = setTimeout(() => {
        const modalElement = document.querySelector(`.${styles.modal}`) as HTMLElement;
        if (modalElement) {
          modalElement.classList.add(styles.active);
        }
      }, 10);
    }
    
    return () => clearTimeout(timer);
  }, [isOpen]);
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate phone number format
  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
    return phoneRegex.test(phone);
  };
  
  // Validate wallet address
  const isValidWalletAddress = (address: string): boolean => {
    // Basic validation: must be at least 20 chars, start with 0x for Ethereum
    if (walletForm.network.value === 'Ethereum') {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
    // Generic validation for other networks
    return address.length >= 20;
  };
  
  // Validate signup form
  const validateSignupForm = (): boolean => {
    let isValid = true;
    const newForm = {...signupForm};
    
    if (!newForm.fullName.value.trim()) {
      newForm.fullName.error = 'Full name is required';
      isValid = false;
    } else {
      newForm.fullName.error = '';
    }
    
    if (!newForm.email.value.trim()) {
      newForm.email.error = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(newForm.email.value)) {
      newForm.email.error = 'Please enter a valid email address';
      isValid = false;
    } else {
      newForm.email.error = '';
    }
    
    if (newForm.phone.value.trim() && !isValidPhone(newForm.phone.value)) {
      newForm.phone.error = 'Please enter a valid phone number';
      isValid = false;
    } else {
      newForm.phone.error = '';
    }
    
    if (!newForm.country.value) {
      newForm.country.error = 'Please select your country';
      isValid = false;
    } else {
      newForm.country.error = '';
    }
    
    if (!newForm.investmentLevel.value) {
      newForm.investmentLevel.error = 'Please select your investment level';
      isValid = false;
    } else {
      newForm.investmentLevel.error = '';
    }
    
    if (!newForm.experience.value) {
      newForm.experience.error = 'Please select your experience level';
      isValid = false;
    } else {
      newForm.experience.error = '';
    }
    
    if (newForm.agreeTerms.value !== 'true') {
      newForm.agreeTerms.error = 'You must agree to the terms and conditions';
      isValid = false;
    } else {
      newForm.agreeTerms.error = '';
    }
    
    setSignupForm(newForm);
    return isValid;
  };
  
  // Validate wallet form
  const validateWalletForm = (): boolean => {
    let isValid = true;
    const newForm = {...walletForm};
    
    if (!newForm.walletAddress.value.trim()) {
      newForm.walletAddress.error = 'Wallet address is required';
      isValid = false;
    } else if (!isValidWalletAddress(newForm.walletAddress.value)) {
      newForm.walletAddress.error = 'Please enter a valid wallet address';
      isValid = false;
    } else {
      newForm.walletAddress.error = '';
    }
    
    if (!newForm.network.value) {
      newForm.network.error = 'Please select a blockchain network';
      isValid = false;
    } else {
      newForm.network.error = '';
    }
    
    if (newForm.agreeTerms.value !== 'true') {
      newForm.agreeTerms.error = 'You must agree to the terms and conditions';
      isValid = false;
    } else {
      newForm.agreeTerms.error = '';
    }
    
    setWalletForm(newForm);
    return isValid;
  };
  
  // Handle form field changes for signup form
  const handleSignupChange = (field: keyof SignupForm, value: string) => {
    setSignupForm(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        touched: true,
        error: '', // Clear error when user types
      }
    }));
  };
  
  // Handle form field changes for wallet form
  const handleWalletChange = (field: keyof WalletForm, value: string) => {
    setWalletForm(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        touched: true,
        error: '', // Clear error when user types
      }
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (form: 'signup' | 'wallet', field: string, checked: boolean) => {
    if (form === 'signup') {
      handleSignupChange(field as keyof SignupForm, checked.toString());
    } else {
      handleWalletChange(field as keyof WalletForm, checked.toString());
    }
  };
  
  // Handle email signup submission
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Track analytics event
      trackEvent('signup_attempt', { 
        method: 'email',
        investmentLevel: signupForm.investmentLevel.value,
        experienceLevel: signupForm.experience.value
      });
      
      // Format data for API
      const formData = {
        fullName: signupForm.fullName.value,
        email: signupForm.email.value,
        phone: signupForm.phone.value || null,
        country: signupForm.country.value,
        investmentLevel: signupForm.investmentLevel.value,
        experience: signupForm.experience.value,
        referralCode: signupForm.referralCode.value || null,
        agreeTerms: signupForm.agreeTerms.value === 'true',
        agreeUpdates: signupForm.agreeUpdates.value === 'true',
      };
      
      // Simulate API call with timeout (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      //await submitRegistration(formData);
      
      // Show success state
      setShowSuccess(true);
      
      // Track successful signup
      trackEvent('signup_success', { method: 'email' });
      
      // Notify parent component
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
      
    } catch (error) {
      console.error('Signup error:', error);
      
      // Track failed signup
      trackEvent('signup_error', { 
        method: 'email',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle wallet signup submission
  const handleWalletSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateWalletForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Track analytics event
      trackEvent('signup_attempt', { 
        method: 'wallet',
        network: walletForm.network.value
      });
      
      // Format data for API
      const formData = {
        walletAddress: walletForm.walletAddress.value,
        network: walletForm.network.value,
        agreeTerms: walletForm.agreeTerms.value === 'true',
      };
      
      // Simulate API call with timeout (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      //await submitRegistration(formData);
      
      // Show success state
      setShowSuccess(true);
      
      // Track successful signup
      trackEvent('signup_success', { method: 'wallet' });
      
      // Notify parent component
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
      
    } catch (error) {
      console.error('Wallet signup error:', error);
      
      // Track failed signup
      trackEvent('signup_error', { 
        method: 'wallet',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle modal close
  const handleClose = () => {
    // First remove the active class to trigger animations
    const modalElement = document.querySelector(`.${styles.modal}`) as HTMLElement;
    if (modalElement) {
      modalElement.classList.remove(styles.active);
    }
    
    // Wait for animation to complete before closing
    setTimeout(() => {
      setModalActive(false);
      setIsLoading(false);
      setShowSuccess(false);
      onClose();
      
      // Reset forms after closing
      setTimeout(() => {
        setSignupForm(initialSignupForm);
        setWalletForm(initialWalletForm);
        setActiveTab('email');
      }, 300);
    }, 300);
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={`${styles.modalOverlay} ${modalActive ? styles.active : ''}`}
      onClick={handleClose}
      role="dialog"
      aria-labelledby="signup-modal-title"
      aria-modal="true"
    >
      <div 
        className={`${styles.modal} ${modalActive ? '' : ''}`}
        onClick={e => e.stopPropagation()}
        ref={modalRef}
      >
        {/* Modal content */}
        <div className={styles.modalContent}>
          {/* Modal header */}
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle} id="signup-modal-title">Join PROSPERA Early Access</h2>
            <button 
              className={styles.closeButton} 
              onClick={handleClose}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
          
          {/* Modal body */}
          <div className={styles.modalBody}>
            <div className={styles.tabs}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'email' ? styles.active : ''}`}
                onClick={() => setActiveTab('email')}
                type="button"
                aria-label="Email registration tab"
                aria-selected={activeTab === 'email'}
              >
                <span className={styles.tabIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                Email Registration
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'wallet' ? styles.active : ''}`}
                onClick={() => setActiveTab('wallet')}
                type="button"
                aria-label="Wallet connection tab"
                aria-selected={activeTab === 'wallet'}
              >
                <span className={styles.tabIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </span>
                Wallet Connection
              </button>
            </div>
            
            <div className={`${styles.tabContent} ${activeTab === 'email' ? styles.active : ''}`}>
              <form className={styles.form} onSubmit={handleEmailSignup}>
                <div className={`${styles.formGroup} ${signupForm.fullName.error ? styles.error : ''}`}>
                  <label className={styles.formLabel} htmlFor="fullName">Full Name</label>
                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      id="fullName"
                      className={styles.formInput}
                      value={signupForm.fullName.value}
                      onChange={(e) => handleSignupChange('fullName', e.target.value)}
                      required
                    />
                  </div>
                  {signupForm.fullName.error && <div className={styles.errorMessage}>{signupForm.fullName.error}</div>}
                </div>
                
                <div className={`${styles.formGroup} ${signupForm.email.error ? styles.error : ''}`}>
                  <label className={styles.formLabel} htmlFor="email">Email Address</label>
                  <div className={styles.inputContainer}>
                    <input
                      type="email"
                      id="email"
                      className={styles.formInput}
                      value={signupForm.email.value}
                      onChange={(e) => handleSignupChange('email', e.target.value)}
                      required
                    />
                  </div>
                  {signupForm.email.error && <div className={styles.errorMessage}>{signupForm.email.error}</div>}
                </div>
                
                <div className={`${styles.formGroup} ${signupForm.phone.error ? styles.error : ''}`}>
                  <label className={styles.formLabel} htmlFor="phone">Phone Number (Optional)</label>
                  <div className={styles.inputContainer}>
                    <input
                      type="tel"
                      id="phone"
                      className={styles.formInput}
                      value={signupForm.phone.value}
                      onChange={(e) => handleSignupChange('phone', e.target.value)}
                      placeholder="+1 123 456 7890"
                    />
                  </div>
                  {signupForm.phone.error && <div className={styles.errorMessage}>{signupForm.phone.error}</div>}
                </div>
                
                <div className={`${styles.formGroup} ${signupForm.country.error ? styles.error : ''}`}>
                  <label className={styles.formLabel} htmlFor="country">Country</label>
                  <div className={styles.selectContainer}>
                    <select
                      id="country"
                      className={styles.formSelect}
                      value={signupForm.country.value}
                      onChange={(e) => handleSignupChange('country', e.target.value)}
                      required
                    >
                      <option value="">Select your country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  {signupForm.country.error && <div className={styles.errorMessage}>{signupForm.country.error}</div>}
                </div>
                
                <div className={`${styles.formGroup} ${signupForm.investmentLevel.error ? styles.error : ''}`}>
                  <label className={styles.formLabel} htmlFor="investmentLevel">Investment Level</label>
                  <div className={styles.selectContainer}>
                    <select
                      id="investmentLevel"
                      className={styles.formSelect}
                      value={signupForm.investmentLevel.value}
                      onChange={(e) => handleSignupChange('investmentLevel', e.target.value)}
                      required
                    >
                      <option value="">Select investment level</option>
                      {investmentLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  {signupForm.investmentLevel.error && <div className={styles.errorMessage}>{signupForm.investmentLevel.error}</div>}
                </div>
                
                <div className={`${styles.formGroup} ${signupForm.experience.error ? styles.error : ''}`}>
                  <label className={styles.formLabel} htmlFor="experience">Investment Experience</label>
                  <div className={styles.selectContainer}>
                    <select
                      id="experience"
                      className={styles.formSelect}
                      value={signupForm.experience.value}
                      onChange={(e) => handleSignupChange('experience', e.target.value)}
                      required
                    >
                      <option value="">Select experience level</option>
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  {signupForm.experience.error && <div className={styles.errorMessage}>{signupForm.experience.error}</div>}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="referralCode">Referral Code (Optional)</label>
                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      id="referralCode"
                      className={styles.formInput}
                      value={signupForm.referralCode.value}
                      onChange={(e) => handleSignupChange('referralCode', e.target.value)}
                      placeholder="Enter referral code if you have one"
                    />
                  </div>
                </div>
                
                <div className={`${styles.formGroup} ${signupForm.agreeTerms.error ? styles.error : ''}`}>
                  <div className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={signupForm.agreeTerms.value === 'true'}
                      onChange={(e) => handleCheckboxChange('signup', 'agreeTerms', e.target.checked)}
                      required
                    />
                    <label className={styles.checkboxLabel} htmlFor="agreeTerms">
                      I agree to the <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a>
                    </label>
                  </div>
                  {signupForm.agreeTerms.error && <div className={styles.errorMessage}>{signupForm.agreeTerms.error}</div>}
                </div>
                
                <div className={styles.formGroup}>
                  <div className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      id="agreeUpdates"
                      checked={signupForm.agreeUpdates.value === 'true'}
                      onChange={(e) => handleCheckboxChange('signup', 'agreeUpdates', e.target.checked)}
                    />
                    <label className={styles.checkboxLabel} htmlFor="agreeUpdates">
                      I'd like to receive updates about PROSPERA
                    </label>
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                    disabled={isLoading}
                  >
                    <span className={styles.buttonText}>Submit Application</span>
                    <div className={styles.buttonGlow}></div>
                  </button>
                </div>
              </form>
            </div>
            
            <div className={`${styles.tabContent} ${activeTab === 'wallet' ? styles.active : ''}`}>
              <div className={styles.walletInfo}>
                <h4 className={styles.walletInfoTitle}>Connect your wallet to get early access</h4>
                <div className={styles.networkIcons}>
                  {networks.map(network => (
                    <span key={network} className={styles.networkIcon}>
                      {network}
                    </span>
                  ))}
                </div>
              </div>
              
              <form className={styles.form} onSubmit={handleWalletSignup}>
                <div className={`${styles.formGroup} ${walletForm.walletAddress.error ? styles.error : ''}`}>
                  <label className={styles.formLabel} htmlFor="walletAddress">Wallet Address</label>
                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      id="walletAddress"
                      className={styles.formInput}
                      value={walletForm.walletAddress.value}
                      onChange={(e) => handleWalletChange('walletAddress', e.target.value)}
                      placeholder="0x..."
                      required
                    />
                  </div>
                  {walletForm.walletAddress.error && <div className={styles.errorMessage}>{walletForm.walletAddress.error}</div>}
                </div>
                
                <div className={`${styles.formGroup} ${walletForm.network.error ? styles.error : ''}`}>
                  <label className={styles.formLabel} htmlFor="network">Blockchain Network</label>
                  <div className={styles.selectContainer}>
                    <select
                      id="network"
                      className={styles.formSelect}
                      value={walletForm.network.value}
                      onChange={(e) => handleWalletChange('network', e.target.value)}
                      required
                    >
                      <option value="">Select blockchain network</option>
                      {networks.map((network) => (
                        <option key={network} value={network}>{network}</option>
                      ))}
                    </select>
                  </div>
                  {walletForm.network.error && <div className={styles.errorMessage}>{walletForm.network.error}</div>}
                </div>
                
                <div className={`${styles.formGroup} ${walletForm.agreeTerms.error ? styles.error : ''}`}>
                  <div className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      id="walletAgreeTerms"
                      checked={walletForm.agreeTerms.value === 'true'}
                      onChange={(e) => handleCheckboxChange('wallet', 'agreeTerms', e.target.checked)}
                      required
                    />
                    <label className={styles.checkboxLabel} htmlFor="walletAgreeTerms">
                      I agree to the <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a>
                    </label>
                  </div>
                  {walletForm.agreeTerms.error && <div className={styles.errorMessage}>{walletForm.agreeTerms.error}</div>}
                </div>
                
                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                    disabled={isLoading}
                  >
                    <span className={styles.buttonText}>Connect Wallet</span>
                    <div className={styles.buttonGlow}></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Success overlay */}
        <div className={`${styles.successOverlay} ${showSuccess ? styles.active : ''}`}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 className={styles.successTitle}>Application Submitted!</h3>
          <p className={styles.successMessage}>
            Thank you for your interest in PROSPERA. We'll review your application and contact you shortly with next steps.
          </p>
        </div>
        
        {/* Visual effects */}
        <div className={styles.modalEffects} aria-hidden="true">
          <div className={styles.glowOrb}></div>
          <div className={styles.gridLines}></div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;