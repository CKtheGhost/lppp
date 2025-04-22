'use client'

import { useState, useEffect } from 'react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import styles from './QuantumCounter.module.css';

interface QuantumCounterProps {
  remainingSpots: number;
  totalSpots: number;
  onButtonClick: () => void;
}

const QuantumCounter = ({ remainingSpots, totalSpots, onButtonClick }: QuantumCounterProps) => {
  // State for animation flags
  const [isLoaded, setIsLoaded] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState('normal'); // normal, medium, high
  
  // Use animated counter hook
  const displayRemaining = useAnimatedCounter(remainingSpots, {
    duration: 1500,
    delay: 300,
    easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  });
  
  // Calculate percentage remaining
  const percentRemaining = Math.round((remainingSpots / totalSpots) * 100);
  const percentFilled = 100 - percentRemaining;
  
  // Initialize on mount
  useEffect(() => {
    // Set initial urgency level
    if (remainingSpots <= 50) {
      setUrgencyLevel('high');
    } else if (remainingSpots <= 100) {
      setUrgencyLevel('medium');
    }
    
    // Set loaded state after a small delay
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(loadTimer);
  }, [remainingSpots]);
  
  // Update when remainingSpots changes
  useEffect(() => {
    // Trigger pulse animation
    setPulsing(true);
    
    // Reset pulse animation
    const pulseTimer = setTimeout(() => {
      setPulsing(false);
    }, 1000);
    
    // Update urgency level
    if (remainingSpots <= 50 && urgencyLevel !== 'high') {
      setUrgencyLevel('high');
    } else if (remainingSpots <= 100 && remainingSpots > 50 && urgencyLevel !== 'medium') {
      setUrgencyLevel('medium');
    }
    
    return () => clearTimeout(pulseTimer);
  }, [remainingSpots, urgencyLevel]);

  return (
    <div className={`${styles.quantumCounter} ${styles[urgencyLevel]} ${isLoaded ? styles.loaded : ''} ${pulsing ? styles.pulsing : ''}`}>
      <div className={styles.counterBorder}></div>
      <div className={styles.counterContent}>
        <div className={styles.counterHeader}>
          <h3 className={styles.counterTitle}>Limited Early Access</h3>
          <p className={styles.counterSubtitle}>Reserve your spot before all positions are filled</p>
        </div>
        
        <div className={styles.counterDisplay}>
          <div className={styles.counterProgressContainer}>
            <div className={styles.counterProgress} style={{ width: `${percentFilled}%` }}></div>
            <div className={`${styles.counterPulse} ${pulsing ? styles.active : ''}`}></div>
          </div>
          
          <div className={styles.counterValues}>
            <div className={styles.counterRemaining}>
              <div className={styles.counterAmount}>{displayRemaining}</div>
              <div className={styles.counterLabel}>Spots Remaining</div>
            </div>
            
            <div className={styles.counterDivider}></div>
            
            <div className={styles.counterTotal}>
              <div className={styles.counterAmount}>{totalSpots}</div>
              <div className={styles.counterLabel}>Total Capacity</div>
            </div>
          </div>
        </div>
        
        <div className={styles.counterCtaContainer}>
          <button 
            className={styles.counterCtaButton} 
            onClick={onButtonClick}
          >
            Secure Your Spot Now
            <div className={styles.btnGlow}></div>
          </button>
        </div>
      </div>
      
      {/* Visual effects */}
      <div className={styles.quantumEffects}>
        <div className={styles.glowOrb}></div>
        <div className={styles.quantumParticles}></div>
      </div>
    </div>
  );
};

export default QuantumCounter;