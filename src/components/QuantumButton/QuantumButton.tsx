// src/components/QuantumButton/QuantumButton.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './QuantumButton.module.css';
import { trackEvent } from '@/utils/analyticsUtils';

export interface QuantumButtonProps {
  /** Button text content */
  children: React.ReactNode;
  /** onClick handler */
  onClick?: () => void;
  /** Optional CSS className to add */
  className?: string;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Button variant style */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Animation intensity (0-1) */
  animationIntensity?: number;
  /** Icon before text */
  startIcon?: React.ReactNode;
  /** Icon after text */
  endIcon?: React.ReactNode;
  /** Color theme */
  theme?: 'green' | 'blue' | 'purple' | 'cyan' | 'red' | 'multi';
  /** Event tracking ID */
  trackingId?: string;
  /** Aria label for accessibility */
  ariaLabel?: string;
  /** Whether to show glow effects */
  glowEffect?: boolean;
  /** Whether to show digital shimmer */
  shimmerEffect?: boolean;
  /** Whether to add neural pulse animation */
  pulseEffect?: boolean;
}

/**
 * QuantumButton Component
 * 
 * A futuristic neural interface button component with advanced visual effects
 * and animation capabilities that match the PROSPERA quantum aesthetic.
 * 
 * @example
 * <QuantumButton
 *   variant="primary"
 *   size="md"
 *   onClick={() => console.log("Neural connection initiated")}
 *   theme="green"
 *   glowEffect
 * >
 *   Initialize Neural Link
 * </QuantumButton>
 */
const QuantumButton: React.FC<QuantumButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  animationIntensity = 0.5,
  startIcon,
  endIcon,
  theme = 'green',
  trackingId,
  ariaLabel,
  glowEffect = true,
  shimmerEffect = true,
  pulseEffect = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [clickEffect, setClickEffect] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  
  // Handle click with tracking and effects
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    if (trackingId) {
      trackEvent('button_click', { id: trackingId, variant, theme });
    }
    
    // Ripple effect position calculation
    if (rippleRef.current && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const rippleSize = Math.max(buttonRect.width, buttonRect.height) * 2;
      const x = e.clientX - buttonRect.left - rippleSize / 2;
      const y = e.clientY - buttonRect.top - rippleSize / 2;
      
      rippleRef.current.style.width = `${rippleSize}px`;
      rippleRef.current.style.height = `${rippleSize}px`;
      rippleRef.current.style.left = `${x}px`;
      rippleRef.current.style.top = `${y}px`;
    }
    
    // Quantum click animation
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 600);
    
    if (onClick) onClick();
  };
  
  // Neural particle emission on hover
  useEffect(() => {
    if (!buttonRef.current || !isHovered || !pulseEffect || animationIntensity === 0) return;
    
    // Skip for reduced motion preference
    if (typeof window !== 'undefined' && 
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const emitInterval = setInterval(() => {
      const particle = document.createElement('span');
      particle.classList.add(styles.neuralParticle);
      
      // Randomize particle appearance
      const size = Math.random() * 6 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Position around button edge
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.max(rect.width, rect.height) / 2;
      const xPos = radius * Math.cos(angle) + radius;
      const yPos = radius * Math.sin(angle) + rect.height / 2;
      
      particle.style.left = `${xPos}px`;
      particle.style.top = `${yPos}px`;
      
      // Set animation duration based on intensity
      const animDuration = (Math.random() * 2 + 1) / animationIntensity;
      particle.style.animationDuration = `${animDuration}s`;
      
      // Add to button and remove when animation completes
      button.appendChild(particle);
      setTimeout(() => {
        button.removeChild(particle);
      }, animDuration * 1000);
    }, 200 / animationIntensity);
    
    return () => {
      clearInterval(emitInterval);
      // Clean up any remaining particles
      const particles = button.querySelectorAll(`.${styles.neuralParticle}`);
      particles.forEach(particle => {
        button.removeChild(particle);
      });
    };
  }, [isHovered, pulseEffect, animationIntensity]);
  
  // Compose class names based on props
  const buttonClasses = [
    styles.button,
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`size${size.toUpperCase()}`],
    styles[theme],
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    loading ? styles.loading : '',
    isHovered ? styles.hovered : '',
    isActive ? styles.active : '',
    clickEffect ? styles.clicked : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      ref={buttonRef}
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
    >
      {/* Background effects */}
      <span className={styles.buttonBackground} aria-hidden="true"></span>
      
      {/* Glow effect */}
      {glowEffect && <span className={styles.glowEffect} aria-hidden="true"></span>}
      
      {/* Shimmer effect */}
      {shimmerEffect && <span className={styles.shimmerEffect} aria-hidden="true"></span>}
      
      {/* Ripple effect container */}
      <span className={styles.rippleContainer} aria-hidden="true">
        <span ref={rippleRef} className={styles.ripple}></span>
      </span>
      
      {/* Button border effect */}
      <span className={styles.buttonBorder} aria-hidden="true"></span>
      
      {/* Button content */}
      <span className={styles.buttonContent}>
        {loading && (
          <span className={styles.loadingSpinner} aria-hidden="true">
            <span className={styles.spinnerRing}></span>
          </span>
        )}
        
        {!loading && startIcon && (
          <span className={styles.startIcon}>{startIcon}</span>
        )}
        
        <span className={styles.buttonText}>{children}</span>
        
        {!loading && endIcon && (
          <span className={styles.endIcon}>{endIcon}</span>
        )}
      </span>
      
      {/* Neural matrix overlay */}
      <span className={styles.matrixOverlay} aria-hidden="true"></span>
    </button>
  );
};

export default QuantumButton;