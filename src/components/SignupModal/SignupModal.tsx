// src/components/SignupModal/SignupModal.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './SignupModal.module.css';
import { submitRegistration } from '@/utils/apiUtils';
import { trackEvent } from '@/utils/analyticsUtils';

// Type definitions
export interface FormField {
  value: string;
  error: string;
  touched: boolean;
}

export interface SignupForm {
  fullName: FormField;
  email: FormField;
  phone: FormField;
  country: FormField;
  investmentLevel: FormField;
  experience: FormField;
  referralCode: FormField;
  agreeTerms: FormField;
  agreeUpdates: FormField;
}

export interface WalletForm {
  walletAddress: FormField;
  network: FormField;
  agreeTerms: FormField;
}

export interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  successTitle?: string;
  successMessage?: string;
  countries?: string[];
  investmentLevels?: string[];
  experienceLevels?: string[];
  networks?: string[];
}

// Default data sets
const defaultCountries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", 
  "Japan", "Singapore", "South Korea", "Switzerland", "Netherlands", 
  "New Zealand", "Sweden", "Norway", "Finland", "Denmark", "Italy", "Spain"
];

const defaultInvestmentLevels = [
  "Tier 1: $1,000 - $10,000",
  "Tier 2: $10,001 - $50,000",
  "Tier 3: $50,001 - $100,000",
  "Tier 4: $100,001+"
];

const defaultExperienceLevels = [
  "Beginner - New to quantum computing & neural interfaces",
  "Intermediate - Some experience with advanced technology",
  "Advanced - Experienced in quantum systems",
  "Professional - Industry background"
];

const defaultNetworks = [
  "Ethereum", "Solana", "Binance Smart Chain", "Polygon", "Avalanche"
];

// Initial form states with empty values
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

const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Join PROSPERA Neural Network",
  subtitle = "Complete your neural profile to secure early access",
  submitButtonText = "Submit Application",
  successTitle = "Neural Connection Established!",
  successMessage = "Thank you for joining the PROSPERA network. Your quantum entanglement request has been approved. We'll contact you shortly with next steps.",
  countries = defaultCountries,
  investmentLevels = defaultInvestmentLevels,
  experienceLevels = defaultExperienceLevels,
  networks = defaultNetworks
}) => {
  // State management
  const [activeTab, setActiveTab] = useState('email');
  const [signupForm, setSignupForm] = useState<SignupForm>(initialSignupForm);
  const [walletForm, setWalletForm] = useState<WalletForm>(initialWalletForm);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number}>>([]);
  
  // Refs for DOM elements and animations
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const formRefs = {
    email: useRef<HTMLFormElement>(null),
    wallet: useRef<HTMLFormElement>(null)
  };
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  // Manage focus when modal opens - accessibility enhancement
  useEffect(() => {
    if (!isOpen) return;
    
    // Short delay to ensure DOM is ready
    const focusTimer = setTimeout(() => {
      // Focus on close button initially for keyboard navigation
      const closeButton = document.querySelector(`.${styles.closeButton}`) as HTMLElement;
      if (closeButton) {
        closeButton.focus();
      }
      
      // Then focus on first input after animation completes
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 600);
    }, 100);
    
    return () => clearTimeout(focusTimer);
  }, [isOpen]);
  
  // Trap focus within modal for accessibility
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      const focusableElements = modalRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) || [];
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      // Handle shift+tab and regular tab at boundaries
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);
  
  // Animation transitions with optimized timings
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen) {
      // Track modal open event
      trackEvent('modal_opened', { modalType: 'signup' });
      
      // Set overlay visible first, then animate modal
      setModalActive(true);
      
      timer = setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.classList.add(styles.active);
        }
      }, 50); // Short delay for smoother animation
      
      // Generate neural particles for visual effect
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 5 + 3
      }));
      setParticles(newParticles);
    }
    
    return () => clearTimeout(timer);
  }, [isOpen]);
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      
      // Prevent body scroll when modal is open
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      
      // Restore body scroll
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, isLoading]);
  
  // Animate particles with efficient rendering
  useEffect(() => {
    if (!particlesRef.current || !isOpen) return;
    
    // Skip animation for reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    let animationFrameId: number | null = null;
    const container = particlesRef.current;
    
    const moveParticles = () => {
      setParticles(prev => 
        prev.map(particle => {
          // Move particles upward with slight randomness
          const newY = particle.y - (particle.speed * 0.1);
          
          // Reset particle when it goes off-screen
          if (newY < -10) {
            return {
              ...particle,
              y: 110, // Start below the container
              x: Math.random() * 100
            };
          }
          
          return {
            ...particle,
            y: newY
          };
        })
      );
      
      animationFrameId = requestAnimationFrame(moveParticles);
    };
    
    animationFrameId = requestAnimationFrame(moveParticles);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isOpen, particles]);
  
  // Form validation utilities
  const validation = {
    // Validate email format
    isValidEmail: (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    // Validate phone number format
    isValidPhone: (phone: string): boolean => {
      if (!phone) return true; // Optional field
      const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
      return phoneRegex.test(phone);
    },
    
    // Validate wallet address
    isValidWalletAddress: (address: string): boolean => {
      if (!address) return false;
      
      // Ethereum address validation
      if (walletForm.network.value === 'Ethereum') {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
      }
      
      // Solana address validation
      if (walletForm.network.value === 'Solana') {
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
      }
      
      // Generic validation for other networks
      return address.length >= 20;
    }
  };
  
  // Validate signup form - memoized for performance
  const validateSignupForm = useCallback((): boolean => {
    let isValid = true;
    const newForm = {...signupForm};
    
    // Required field validation
    const requiredFields: Array<keyof SignupForm> = ['fullName', 'email', 'country', 'investmentLevel', 'experience'];
    
    requiredFields.forEach(field => {
      if (!newForm[field].value.trim()) {
        newForm[field].error = `${field === 'fullName' ? 'Full name' : field} is required`;
        isValid = false;
      } else {
        newForm[field].error = '';
      }
    });
    
    // Email format validation
    if (newForm.email.value.trim() && !validation.isValidEmail(newForm.email.value)) {
      newForm.email.error = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Phone format validation (optional field)
    if (newForm.phone.value.trim() && !validation.isValidPhone(newForm.phone.value)) {
      newForm.phone.error = 'Please enter a valid phone number';
      isValid = false;
    }
    
    // Terms agreement validation
    if (newForm.agreeTerms.value !== 'true') {
      newForm.agreeTerms.error = 'You must agree to the neural integration protocol';
      isValid = false;
    } else {
      newForm.agreeTerms.error = '';
    }
    
    setSignupForm(newForm);
    return isValid;
  }, [signupForm, validation.isValidEmail, validation.isValidPhone]);
  
  // Validate wallet form - memoized for performance
  const validateWalletForm = useCallback((): boolean => {
    let isValid = true;
    const newForm = {...walletForm};
    
    // Wallet address validation
    if (!newForm.walletAddress.value.trim()) {
      newForm.walletAddress.error = 'Wallet address is required';
      isValid = false;
    } else if (!validation.isValidWalletAddress(newForm.walletAddress.value)) {
      newForm.walletAddress.error = 'Please enter a valid wallet address';
      isValid = false;
    } else {
      newForm.walletAddress.error = '';
    }
    
    // Network selection validation
    if (!newForm.network.value) {
      newForm.network.error = 'Please select a blockchain network';
      isValid = false;
    } else {
      newForm.network.error = '';
    }
    
    // Terms agreement validation
    if (newForm.agreeTerms.value !== 'true') {
      newForm.agreeTerms.error = 'You must agree to the neural integration protocol';
      isValid = false;
    } else {
      newForm.agreeTerms.error = '';
    }
    
    setWalletForm(newForm);
    return isValid;
  }, [walletForm, validation.isValidWalletAddress]);
  
  // Form field change handlers
  const handleSignupChange = useCallback((field: keyof SignupForm, value: string) => {
    setSignupForm(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        touched: true,
        error: '', // Clear error when user types
      }
    }));
  }, []);
  
  const handleWalletChange = useCallback((field: keyof WalletForm, value: string) => {
    setWalletForm(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        touched: true,
        error: '', // Clear error when user types
      }
    }));
  }, []);
  
  // Handle checkbox changes
  const handleCheckboxChange = useCallback((form: 'signup' | 'wallet', field: string, checked: boolean) => {
    if (form === 'signup') {
      handleSignupChange(field as keyof SignupForm, checked.toString());
    } else {
      handleWalletChange(field as keyof WalletForm, checked.toString());
    }
  }, [handleSignupChange, handleWalletChange]);
  
  // Handle email signup submission with error handling
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) {
      // Scroll to first error
      const firstErrorField = Object.entries(signupForm)
        .find(([_, field]) => field.error)
        ?.[0];
        
      if (firstErrorField) {
        const errorElement = document.getElementById(firstErrorField);
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement?.focus();
      }
      return;
    }
    
    setIsLoading(true);
    
    try {
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
      
      // Track form submission event
      trackEvent('signup_submit', { method: 'email' });
      
      try {
        // API call (commented out to prevent actual network calls in the example)
        // const response = await submitRegistration(formData);
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success state
        setShowSuccess(true);
        
        // Track successful submission
        trackEvent('signup_success', { method: 'email' });
        
        // Notify parent component after delay
        setTimeout(() => {
          onSuccess();
        }, 3000);
      } catch (error) {
        console.error('API error:', error);
        trackEvent('signup_error', { method: 'email', error: String(error) });
        
        // Set form-level error
        setSignupForm(prev => ({
          ...prev,
          email: {
            ...prev.email,
            error: 'An error occurred. Please try again.'
          }
        }));
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle wallet signup submission with error handling
  const handleWalletSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateWalletForm()) {
      // Scroll to first error
      const firstErrorField = Object.entries(walletForm)
        .find(([_, field]) => field.error)
        ?.[0];
        
      if (firstErrorField) {
        const errorElement = document.getElementById(`wallet_${firstErrorField}`);
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement?.focus();
      }
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format data for API
      const formData = {
        walletAddress: walletForm.walletAddress.value,
        network: walletForm.network.value,
        agreeTerms: walletForm.agreeTerms.value === 'true',
      };
      
      // Track form submission event
      trackEvent('signup_submit', { method: 'wallet' });
      
      try {
        // API call (commented out to prevent actual network calls in the example)
        // const response = await submitRegistration(formData);
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success state
        setShowSuccess(true);
        
        // Track successful submission
        trackEvent('signup_success', { method: 'wallet' });
        
        // Notify parent component after delay
        setTimeout(() => {
          onSuccess();
        }, 3000);
      } catch (error) {
        console.error('API error:', error);
        trackEvent('signup_error', { method: 'wallet', error: String(error) });
        
        // Set form-level error
        setWalletForm(prev => ({
          ...prev,
          walletAddress: {
            ...prev.walletAddress,
            error: 'An error occurred. Please try again.'
          }
        }));
      }
    } catch (error) {
      console.error('Wallet signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle modal close with proper cleanup
  const handleClose = useCallback(() => {
    if (isLoading) return;
    
    setIsClosing(true);
    trackEvent('modal_closed', { modalType: 'signup' });
    
    // First remove the active class to trigger animations
    if (modalRef.current) {
      modalRef.current.classList.remove(styles.active);
    }
    
    // Wait for animation to complete before closing
    setTimeout(() => {
      setModalActive(false);
      setIsLoading(false);
      setShowSuccess(false);
      setIsClosing(false);
      onClose();
      
      // Reset forms after a delay
      setTimeout(() => {
        setSignupForm(initialSignupForm);
        setWalletForm(initialWalletForm);
        setActiveTab('email');
      }, 300);
    }, 500);
  }, [isLoading, onClose]);
  
  // Generates a wavy border effect
  const WavyBorder = () => (
    <svg className={styles.wavyBorder} width="100%" height="5" viewBox="0 0 1200 5" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,0 C100,5 200,0 300,0 C400,5 500,0 600,0 C700,5 800,0 900,0 C1000,5 1100,0 1200,0 L1200,5 L0,5 Z" />
    </svg>
  );
  
  // Neural particle elements for visual effect
  const renderParticles = () => {
    return particles.map(particle => (
      <div
        key={particle.id}
        className={styles.neuralParticle}
        style={{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
        }}
        aria-hidden="true"
      />
    ));
  };
  
  // Skip rendering if not open or active
  if (!isOpen && !modalActive) return null;

  return (
    <div 
      className={`${styles.modalOverlay} ${modalActive ? styles.active : ''}`}
      onClick={isLoading || isClosing ? undefined : handleClose}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
      aria-describedby="modal-description"
    >
      <div 
        className={styles.modal}
        ref={modalRef}
        onClick={e => e.stopPropagation()}
      >
        {/* Neural particle background effect */}
        <div ref={particlesRef} className={styles.neuralParticles} aria-hidden="true">
          {renderParticles()}
        </div>
        
        {/* Modal content */}
        <div className={styles.modalContent} ref={modalContentRef}>
          {/* Modal header */}
          <div className={styles.modalHeader}>
            <WavyBorder />
            <h2 id="modal-title" className={styles.modalTitle}>
              {title}
              <span className={styles.titleGlow} aria-hidden="true"></span>
            </h2>
            <p id="modal-description" className={styles.modalSubtitle}>{subtitle}</p>
            <button 
              type="button"
              className={styles.closeButton} 
              onClick={handleClose}
              aria-label="Close modal"
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={styles.buttonGlow} aria-hidden="true"></span>
            </button>
          </div>
          
          {/* Modal body */}
          <div className={styles.modalBody}>
            {/* Tabs */}
            <div className={styles.tabs} role="tablist" aria-label="Registration methods">
              <button 
                type="button"
                className={`${styles.tabButton} ${activeTab === 'email' ? styles.active : ''}`}
                onClick={() => setActiveTab('email')}
                aria-selected={activeTab === 'email'}
                aria-controls="email-panel"
                id="email-tab"
                role="tab"
              >
                <span className={styles.tabIcon} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <span>Email Registration</span>
                <div className={styles.tabGlow} aria-hidden="true"></div>
              </button>
              
              <button 
                type="button"
                className={`${styles.tabButton} ${activeTab === 'wallet' ? styles.active : ''}`}
                onClick={() => setActiveTab('wallet')}
                aria-selected={activeTab === 'wallet'}
                aria-controls="wallet-panel"
                id="wallet-tab"
                role="tab"
              >
                <span className={styles.tabIcon} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </span>
                <span>Wallet Connection</span>
                <div className={styles.tabGlow} aria-hidden="true"></div>
              </button>
            </div>
            
            {/* Email Registration Form */}
            <div 
              id="email-panel"
              className={`${styles.tabContent} ${activeTab === 'email' ? styles.active : ''}`}
              role="tabpanel"
              aria-labelledby="email-tab"
            >
              <form 
                className={styles.form} 
                onSubmit={handleEmailSignup}
                ref={formRefs.email}
                noValidate
              >
                <div className={`${styles.formGroup} ${signupForm.fullName.error ? styles.error : ''}`}>
                  <label className={styles.formLabel} htmlFor="fullName">Full Name</label>
                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      id="fullName"
                      className={styles.formInput}
                      value={signupForm.fullName.value}
                      onChange={(e) => handleSignupChange('fullName', e.target.value)}
                      disabled={isLoading}
                      autoComplete="name"
                      required
                      ref={firstInputRef}
                      aria-required="true"
                      aria-invalid={!!signupForm.fullName.error}
                      aria-describedby={signupForm.fullName.error ? "fullName-error" : undefined}
                    />
                    <div className={styles.inputFocus} aria-hidden="true"></div>
                  </div>
                  {signupForm.fullName.error && (
                    <div className={styles.errorMessage} id="fullName-error" role="alert">{signupForm.fullName.error}</div>
                  )}
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
                      disabled={isLoading}
                      autoComplete="email"
                      required
                      aria-required="true"
                      aria-invalid={!!signupForm.email.error}
                      aria-describedby={signupForm.email.error ? "email-error" : undefined}
                    />
                    <div className={styles.inputFocus} aria-hidden="true"></div>
                  </div>
                  {signupForm.email.error && (
                    <div className={styles.errorMessage} id="email-error" role="alert">{signupForm.email.error}</div>
                  )}
                </div>
                
                <div className={`${styles.formGroup} ${signupForm.phone.error ? styles.error : ''}`}>
                  <label className={styles.formLabel} htmlFor="phone">
                    Phone Number <span className={styles.optional}>(Optional)</span>
                  </label>
                  <div className={styles.inputContainer}>
                    <input
                      type="tel"
                      id="phone"
                      className={styles.formInput}
                      value={signupForm.phone.value}
                      onChange={(e) => handleSignupChange('phone', e.target.value)}
                      disabled={isLoading}
                      autoComplete="tel"
                      placeholder="+1 123 456 7890"
                      aria-required="false"
                      aria-invalid={!!signupForm.phone.error}
                      aria-describedby={signupForm.phone.error ? "phone-error" : undefined}
                    />
                    <div className={styles.inputFocus} aria-hidden="true"></div>
                  </div>
                  {signupForm.phone.error && (
                    <div className={styles.errorMessage} id="phone-error" role="alert">{signupForm.phone.error}</div>
                  )}
                </div>
                
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf} ${signupForm.country.error ? styles.error : ''}`}>
                    <label className={styles.formLabel} htmlFor="country">Country</label>
                    <div className={styles.selectContainer}>
                      <select
                        id="country"
                        className={styles.formSelect}
                        value={signupForm.country.value}
                        onChange={(e) => handleSignupChange('country', e.target.value)}
                        disabled={isLoading}
                        required
                        aria-required="true"
                        aria-invalid={!!signupForm.country.error}
                        aria-describedby={signupForm.country.error ? "country-error" : undefined}
                      >
                        <option value="">Select country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      <div className={styles.selectArrow} aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                      <div className={styles.inputFocus} aria-hidden="true"></div>
                    </div>
                    {signupForm.country.error && (
                      <div className={styles.errorMessage} id="country-error" role="alert">{signupForm.country.error}</div>
                    )}
                  </div>
                  
                  <div className={`${styles.formGroup} ${styles.formGroupHalf} ${signupForm.investmentLevel.error ? styles.error : ''}`}>
                    <label className={styles.formLabel} htmlFor="investmentLevel">Investment Tier</label>
                    <div className={styles.selectContainer}>
                      <select
                        id="investmentLevel"
                        className={styles.formSelect}
                        value={signupForm.investmentLevel.value}
                        onChange={(e) => handleSignupChange('investmentLevel', e.target.value)}
                        disabled={isLoading}
                        required
                        aria-required="true"
                        aria-invalid={!!signupForm.investmentLevel.error}
                        aria-describedby={signupForm.investmentLevel.error ? "investmentLevel-error" : undefined}
                      >
                        <option value="">Select tier</option>
                        {investmentLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                      <div className={styles.selectArrow} aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                      <div className={styles.inputFocus} aria-hidden="true"></div>
                    </div>
                    {signupForm.investmentLevel.error && (
                      <div className={styles.errorMessage} id="investmentLevel-error" role="alert">{signupForm.investmentLevel.error}</div>
                    )}
                  </div>
                </div>
                
                <div className={`${styles.formGroup} ${signupForm.experience.error ? styles.error : ''}`}>
                  <label className={styles.formLabel} htmlFor="experience">Experience Level</label>
                  <div className={styles.selectContainer}>
                    <select
                      id="experience"
                      className={styles.formSelect}
                      value={signupForm.experience.value}
                      onChange={(e) => handleSignupChange('experience', e.target.value)}
                      disabled={isLoading}
                      required
                      aria-required="true"
                      aria-invalid={!!signupForm.experience.error}
                      aria-describedby={signupForm.experience.error ? "experience-error" : undefined}
                    >
                      <option value="">Select experience</option>
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    <div className={styles.selectArrow} aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    <div className={styles.inputFocus} aria-hidden="true"></div>
                  </div>
                  {signupForm.experience.error && (
                    <div className={styles.errorMessage} id="experience-error" role="alert">{signupForm.experience.error}</div>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="referralCode">
                    Referral Code <span className={styles.optional}>(Optional)</span>
                  </label>
                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      id="referralCode"
                      className={styles.formInput}
                      value={signupForm.referralCode.value}
                      onChange={(e) => handleSignupChange('referralCode', e.target.value)}
                      disabled={isLoading}
                      placeholder="Enter referral code if you have one"
                      aria-required="false"
                    />
                    <div className={styles.inputFocus} aria-hidden="true"></div>
                  </div>
                </div>
                
                <div className={`${styles.formGroup} ${signupForm.agreeTerms.error ? styles.error : ''}`}>
                  <div className={styles.checkboxContainer}>
                    <div className={styles.customCheckbox}>
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={signupForm.agreeTerms.value === 'true'}
                        onChange={(e) => handleCheckboxChange('signup', 'agreeTerms', e.target.checked)}
                        disabled={isLoading}
                        required
                        aria-required="true"
                        aria-invalid={!!signupForm.agreeTerms.error}
                        aria-describedby={signupForm.agreeTerms.error ? "agreeTerms-error" : undefined}
                      />
                      <div className={styles.checkboxIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <label className={styles.checkboxLabel} htmlFor="agreeTerms">
                      I agree to the <a href="#" className={styles.formLink}>Neural Integration Protocol</a> and <a href="#" className={styles.formLink}>Quantum Privacy Policy</a>
                    </label>
                  </div>
                  {signupForm.agreeTerms.error && (
                    <div className={styles.errorMessage} id="agreeTerms-error" role="alert">{signupForm.agreeTerms.error}</div>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <div className={styles.checkboxContainer}>
                    <div className={styles.customCheckbox}>
                      <input
                        type="checkbox"
                        id="agreeUpdates"
                        checked={signupForm.agreeUpdates.value === 'true'}
                        onChange={(e) => handleCheckboxChange('signup', 'agreeUpdates', e.target.checked)}
                        disabled={isLoading}
                        aria-required="false"
                      />
                      <div className={styles.checkboxIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <label className={styles.checkboxLabel} htmlFor="agreeUpdates">
                      I'd like to receive updates about PROSPERA neural advancements
                    </label>
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                    disabled={isLoading}
                    aria-busy={isLoading}
                  >
                    <span className={styles.buttonText}>{submitButtonText}</span>
                    <span className={styles.buttonGlow} aria-hidden="true"></span>
                    {isLoading && <span className={styles.loadingSpinner} aria-hidden="true"></span>}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Wallet Connection Form */}
            <div 
              id="wallet-panel"
              className={`${styles.tabContent} ${activeTab === 'wallet' ? styles.active : ''}`}
              role="tabpanel"
              aria-labelledby="wallet-tab"
            >
              <div className={styles.walletInfo}>
                <h4 className={styles.walletInfoTitle}>Connect your wallet to secure your neural interface</h4>
                <p className={styles.walletInfoText}>
                  Secure your position in the quantum network by connecting your cryptocurrency wallet. 
                  This establishes a cryptographically secure entanglement with the PROSPERA neural ecosystem.
                </p>
                <div className={styles.networkIcons}>
                  {networks.map(network => (
                    <span key={network} className={styles.networkIcon} aria-label={`${network} network`}>
                      {network}
                    </span>
                  ))}
                </div>
              </div>
              
              <form 
                className={styles.form} 
                onSubmit={handleWalletSignup}
                ref={formRefs.wallet}
                noValidate
              >
                <div className={`${styles.formGroup} ${walletForm.walletAddress.error ? styles.error : ''}`}>
                  <label className={styles.formLabel} htmlFor="wallet_walletAddress">Wallet Address</label>
                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      id="wallet_walletAddress"
                      className={styles.formInput}
                      value={walletForm.walletAddress.value}
                      onChange={(e) => handleWalletChange('walletAddress', e.target.value)}
                      disabled={isLoading}
                      placeholder="0x..."
                      required
                      aria-required="true"
                      aria-invalid={!!walletForm.walletAddress.error}
                      aria-describedby={walletForm.walletAddress.error ? "wallet_walletAddress-error" : undefined}
                    />
                    <div className={styles.inputFocus} aria-hidden="true"></div>
                  </div>
                  {walletForm.walletAddress.error && (
                    <div className={styles.errorMessage} id="wallet_walletAddress-error" role="alert">{walletForm.walletAddress.error}</div>
                  )}
                </div>
                
                <div className={`${styles.formGroup} ${walletForm.network.error ? styles.error : ''}`}>
                  <label className={styles.formLabel} htmlFor="wallet_network">Blockchain Network</label>
                  <div className={styles.selectContainer}>
                    <select
                      id="wallet_network"
                      className={styles.formSelect}
                      value={walletForm.network.value}
                      onChange={(e) => handleWalletChange('network', e.target.value)}
                      disabled={isLoading}
                      required
                      aria-required="true"
                      aria-invalid={!!walletForm.network.error}
                      aria-describedby={walletForm.network.error ? "wallet_network-error" : undefined}
                    >
                      <option value="">Select network</option>
                      {networks.map((network) => (
                        <option key={network} value={network}>{network}</option>
                      ))}
                    </select>
                    <div className={styles.selectArrow} aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    <div className={styles.inputFocus} aria-hidden="true"></div>
                  </div>
                  {walletForm.network.error && (
                    <div className={styles.errorMessage} id="wallet_network-error" role="alert">{walletForm.network.error}</div>
                  )}
                </div>
                
                <div className={`${styles.formGroup} ${walletForm.agreeTerms.error ? styles.error : ''}`}>
                  <div className={styles.checkboxContainer}>
                    <div className={styles.customCheckbox}>
                      <input
                        type="checkbox"
                        id="wallet_agreeTerms"
                        checked={walletForm.agreeTerms.value === 'true'}
                        onChange={(e) => handleCheckboxChange('wallet', 'agreeTerms', e.target.checked)}
                        disabled={isLoading}
                        required
                        aria-required="true"
                        aria-invalid={!!walletForm.agreeTerms.error}
                        aria-describedby={walletForm.agreeTerms.error ? "wallet_agreeTerms-error" : undefined}
                      />
                      <div className={styles.checkboxIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <label className={styles.checkboxLabel} htmlFor="wallet_agreeTerms">
                      I agree to the <a href="#" className={styles.formLink}>Neural Integration Protocol</a> and <a href="#" className={styles.formLink}>Quantum Privacy Policy</a>
                    </label>
                  </div>
                  {walletForm.agreeTerms.error && (
                    <div className={styles.errorMessage} id="wallet_agreeTerms-error" role="alert">{walletForm.agreeTerms.error}</div>
                  )}
                </div>
                
                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                    disabled={isLoading}
                    aria-busy={isLoading}
                  >
                    <span className={styles.buttonText}>Connect Neural Interface</span>
                    <span className={styles.buttonGlow} aria-hidden="true"></span>
                    {isLoading && <span className={styles.loadingSpinner} aria-hidden="true"></span>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Success overlay */}
        <div 
          className={`${styles.successOverlay} ${showSuccess ? styles.active : ''}`}
          ref={successRef}
          role="alert"
          aria-live="assertive"
        >
          <div className={styles.successIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div className={styles.successRing}></div>
            <div className={styles.successRing}></div>
            <div className={styles.successRing}></div>
          </div>
          
          <h3 className={styles.successTitle}>{successTitle}</h3>
          <p className={styles.successMessage}>{successMessage}</p>
          
          {/* Success neural particles */}
          <div className={styles.successParticles} aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className={styles.successParticle}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
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