// src/components/QuantumSidebar/QuantumSidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styles from './QuantumSidebar.module.css';

export interface QuantumSidebarProps {
  remainingSpots: number;
  totalSpots: number;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  onButtonClick: () => void;
  alwaysVisible?: boolean;
}

const QuantumSidebar: React.FC<QuantumSidebarProps> = ({
  remainingSpots,
  totalSpots,
  countdown,
  onButtonClick,
  alwaysVisible = false
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activeUnit, setActiveUnit] = useState<string | null>(null);
  
  // Set loaded state after a small delay to trigger animations
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(loadTimer);
  }, []);
  
  // Calculate percentage filled
  const percentFilled = Math.floor(100 - (remainingSpots / totalSpots) * 100);
  
  // Determine which time unit is active (for animation purposes)
  useEffect(() => {
    let unit = null;
    
    if (countdown.seconds % 10 === 0) {
      if (countdown.seconds === 0 && countdown.minutes === 0 && countdown.hours === 0) {
        unit = 'days';
      } else if (countdown.seconds === 0 && countdown.minutes === 0) {
        unit = 'hours';
      } else if (countdown.seconds === 0) {
        unit = 'minutes';
      } else {
        unit = 'seconds';
      }
      
      setActiveUnit(unit);
      
      // Reset active state after animation
      const timer = setTimeout(() => {
        setActiveUnit(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // Format time unit with leading zero if needed
  const formatTimeUnit = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
  };

  return (
    <div className={`${styles.sidebar} ${isLoaded || alwaysVisible ? styles.loaded : ''} ${alwaysVisible ? styles.alwaysVisible : ''}`}>
      {/* Combined quantum counter card */}
      <div className={styles.card}>
        <div className={styles.cardBorder}></div>
        
        <div className={styles.cardContent}>
          <div className={styles.header}>
            <h3 className={styles.title}>Quantum Neural Access</h3>
            <p className={styles.subtitle}>Limited spots available - secure your neural connection now</p>
          </div>
          
          {/* Progress section */}
          <div className={styles.progressSection}>
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar}
                style={{ width: `${percentFilled}%` }}
              ></div>
            </div>
            
            <div className={styles.valuesContainer}>
              <div className={styles.valueBox}>
                <div className={`${styles.value} ${styles.remainingValue}`}>
                  {remainingSpots}
                </div>
                <div className={styles.valueLabel}>Spots Remaining</div>
              </div>
              
              <div className={styles.divider}></div>
              
              <div className={styles.valueBox}>
                <div className={`${styles.value} ${styles.totalValue}`}>
                  {totalSpots}
                </div>
                <div className={styles.valueLabel}>Total Capacity</div>
              </div>
            </div>
          </div>
          
          {/* Section divider */}
          <div className={styles.sectionDivider}></div>
          
          {/* Countdown section */}
          <div className={styles.countdownSection}>
            <div className={styles.countdownHeader}>
              <div className={styles.countdownTitle}>Access Closing In</div>
            </div>
            
            <div className={styles.countdownDisplay}>
              <div className={`${styles.timeUnit} ${activeUnit === 'days' ? styles.active : ''}`}>
                <div className={styles.timeBox}>
                  <span className={styles.timeDigits}>{formatTimeUnit(countdown.days)}</span>
                </div>
                <div className={styles.timeLabel}>Days</div>
              </div>
              
              <div className={`${styles.timeUnit} ${activeUnit === 'hours' ? styles.active : ''}`}>
                <div className={styles.timeBox}>
                  <span className={styles.timeDigits}>{formatTimeUnit(countdown.hours)}</span>
                </div>
                <div className={styles.timeLabel}>Hours</div>
              </div>
              
              <div className={`${styles.timeUnit} ${activeUnit === 'minutes' ? styles.active : ''}`}>
                <div className={styles.timeBox}>
                  <span className={styles.timeDigits}>{formatTimeUnit(countdown.minutes)}</span>
                </div>
                <div className={styles.timeLabel}>Minutes</div>
              </div>
              
              <div className={`${styles.timeUnit} ${activeUnit === 'seconds' ? styles.active : ''}`}>
                <div className={styles.timeBox}>
                  <span className={styles.timeDigits}>{formatTimeUnit(countdown.seconds)}</span>
                </div>
                <div className={styles.timeLabel}>Seconds</div>
              </div>
            </div>
          </div>
          
          {/* Single CTA button */}
          <button className={styles.button} onClick={onButtonClick}>
            Secure Neural Access Now
            <div className={styles.buttonGlow}></div>
          </button>
        </div>
        
        <div className={styles.quantumEffects} aria-hidden="true">
          <div className={styles.glowOrb}></div>
          <div className={styles.gridLines}></div>
          
          {/* Enhanced neural effects */}
          <div className={styles.neuralNodes}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={`node-${i}`} 
                className={styles.neuralNode}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`
                }}
              />
            ))}
          </div>
          
          <div className={styles.dataStream}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={`stream-${i}`} 
                className={styles.dataLine}
                style={{
                  top: `${20 + i * 30}%`,
                  animationDelay: `${i * 0.5}s`,
                  height: `${1 + i * 0.2}px`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumSidebar;