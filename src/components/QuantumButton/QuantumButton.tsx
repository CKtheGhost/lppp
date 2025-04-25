// src/components/QuantumButton/QuantumButton.tsx
'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import styles from './QuantumButton.module.css';
import { trackEvent } from '@/utils/analyticsUtils';
import { debounce } from '@/utils/performanceUtils';

export interface QuantumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  animationIntensity?: number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  theme?: 'green' | 'blue' | 'purple' | 'cyan' | 'red' | 'multi';
  trackingId?: string;
  ariaLabel?: string;
  glowEffect?: boolean;
  shimmerEffect?: boolean;
  pulseEffect?: boolean;
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const QuantumButton = React.memo<QuantumButtonProps>(({
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
  
  // Memoize button classes
  const buttonClasses = useMemo(() => [
    styles.button,
    styles[`variant${capitalize(variant)}`],
    styles[`size${size.toUpperCase()}`],
    styles[theme],
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    loading ? styles.loading : '',
    isHovered ? styles.hovered : '',
    isActive ? styles.active : '',
    clickEffect ? styles.clicked : '',
    className
  ].filter(Boolean).join(' '), [variant, size, theme, fullWidth, disabled, loading, isHovered, isActive, clickEffect, className]);
  
  // Debounced click handler
  const handleClick = useMemo(() => debounce((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    if (trackingId) {
      trackEvent('button_click', { id: trackingId, variant, theme });
    }
    
    // Ripple effect calculation
    if (rippleRef.current && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const rippleSize = Math.max(buttonRect.width, buttonRect.height) * 2;
      const x = e.clientX - buttonRect.left - rippleSize / 2;
      const y = e.clientY - buttonRect.top - rippleSize / 2;
      
      Object.assign(rippleRef.current.style, {
        width: `${rippleSize}px`,
        height: `${rippleSize}px`,
        left: `${x}px`,
        top: `${y}px`
      });
    }
    
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 600);
    
    onClick?.();
  }, 300), [disabled, loading, trackingId, variant, theme, onClick]);
  
  // Mouse event handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsActive(false);
  }, []);
  const handleMouseDown = useCallback(() => setIsActive(true), []);
  const handleMouseUp = useCallback(() => setIsActive(false), []);
  
  // Particle effect
  useEffect(() => {
    if (!buttonRef.current || !isHovered || !pulseEffect || animationIntensity === 0) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    
    const createParticle = () => {
      const particle = document.createElement('span');
      particle.classList.add(styles.neuralParticle);
      
      const size = Math.random() * 6 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.max(rect.width, rect.height) / 2;
      const xPos = radius * Math.cos(angle) + radius;
      const yPos = radius * Math.sin(angle) + rect.height / 2;
      
      particle.style.left = `${xPos}px`;
      particle.style.top = `${yPos}px`;
      
      const animDuration = (Math.random() * 2 + 1) / animationIntensity;
      particle.style.animationDuration = `${animDuration}s`;
      
      button.appendChild(particle);
      setTimeout(() => button.removeChild(particle), animDuration * 1000);
    };
    
    const intervalId = setInterval(createParticle, 200 / animationIntensity);
    
    return () => {
      clearInterval(intervalId);
      const particles = button.querySelectorAll(`.${styles.neuralParticle}`);
      particles.forEach(particle => button.removeChild(particle));
    };
  }, [isHovered, pulseEffect, animationIntensity]);
  
  return (
    <button
      ref={buttonRef}
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
    >
      <span className={styles.buttonBackground} aria-hidden="true" />
      {glowEffect && <span className={styles.glowEffect} aria-hidden="true" />}
      {shimmerEffect && <span className={styles.shimmerEffect} aria-hidden="true" />}
      
      <span className={styles.rippleContainer} aria-hidden="true">
        <span ref={rippleRef} className={styles.ripple} />
      </span>
      
      <span className={styles.buttonBorder} aria-hidden="true" />
      
      <span className={styles.buttonContent}>
        {loading && (
          <span className={styles.loadingSpinner} aria-hidden="true">
            <span className={styles.spinnerRing} />
          </span>
        )}
        
        {!loading && startIcon && <span className={styles.startIcon}>{startIcon}</span>}
        <span className={styles.buttonText}>{children}</span>
        {!loading && endIcon && <span className={styles.endIcon}>{endIcon}</span>}
      </span>
      
      <span className={styles.matrixOverlay} aria-hidden="true" />
    </button>
  );
});

QuantumButton.displayName = 'QuantumButton';

export default QuantumButton;