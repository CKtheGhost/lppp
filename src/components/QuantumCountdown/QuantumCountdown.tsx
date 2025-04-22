'use client'

import { useState, useEffect } from 'react';
import styles from './QuantumCountdown.module.css';

interface CountdownProps {
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  onButtonClick: () => void;
}

const QuantumCountdown = ({ countdown, onButtonClick }: CountdownProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeUnit, setActiveUnit] = useState<string | null>(null);
  
  // Time units with labels
  const timeUnits = [
    { id: 'days', value: countdown.days, label: 'Days' },
    { id: 'hours', value: countdown.hours, label: 'Hours' },
    { id: 'minutes', value: countdown.minutes, label: 'Minutes' },
    { id: 'seconds', value: countdown.seconds, label: 'Seconds' }
  ];
  
  // Set loaded state after a small delay
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(loadTimer);
  }, []);
  
  // Highlight changing units
  useEffect(() => {
    // Find the first unit that changed
    const changedUnit = timeUnits.find(unit => {
      const prevValue = unit.id === 'days' ? countdown.days :
                        unit.id === 'hours' ? countdown.hours :
                        unit.id === 'minutes' ? countdown.minutes :
                        countdown.seconds;
                        
      return prevValue !== unit.value;
    });
    
    if (changedUnit) {
      setActiveUnit(changedUnit.id);
      
      const resetTimer = setTimeout(() => {
        setActiveUnit(null);
      }, 1000);
      
      return () => clearTimeout(resetTimer);
    }
  }, [countdown]);

  return (
    <div className={`${styles.quantumCountdown} ${isLoaded ? styles.loaded : ''}`}>
      <div className={styles.countdownBorder}></div>
      <div className={styles.countdownContent}>
        <div className={styles.countdownHeader}>
          <h3 className={styles.countdownTitle}>Early Access Closing In</h3>
          <p className={styles.countdownSubtitle}>Secure your spot before applications close</p>
        </div>
        
        <div className={styles.countdownDisplay}>
          {timeUnits.map((unit) => (
            <div 
              key={unit.id} 
              className={`${styles.countdownUnit} ${activeUnit === unit.id ? styles.active : ''}`}
            >
              <div className={styles.unitValue}>
                <span className={styles.valueDigits}>
                  {unit.value < 10 ? `0${unit.value}` : unit.value}
                </span>
                <div className={styles.valueGlow}></div>
              </div>
              <div className={styles.unitLabel}>{unit.label}</div>
            </div>
          ))}
        </div>
        
        <div className={styles.countdownCtaContainer}>
          <button 
            className={styles.countdownCtaButton} 
            onClick={onButtonClick}
          >
            Apply Now
            <div className={styles.btnGlow}></div>
          </button>
        </div>
      </div>
      
      {/* Visual effects */}
      <div className={styles.quantumEffects}>
        <div className={styles.glowOrb}></div>
        <div className={styles.gridLines}></div>
      </div>
    </div>
  );
};

export default QuantumCountdown;