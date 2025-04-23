'use client';

import React, { useState, useEffect } from 'react';
import styles from './WormholeTransition.module.css';

interface WormholeTransitionProps {
  isActive: boolean;
  onTransitionComplete: () => void;
  destination: string;
}

const WormholeTransition: React.FC<WormholeTransitionProps> = ({
  isActive,
  onTransitionComplete,
  destination
}) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }
    
    let startTime: number | null = null;
    const duration = 1500; // 1.5 seconds for transition
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      
      setProgress(newProgress);
      
      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Transition complete
        setTimeout(() => {
          onTransitionComplete();
        }, 300);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isActive, onTransitionComplete]);
  
  if (!isActive && progress === 0) return null;
  
  return (
    <div className={`${styles.wormholeContainer} ${isActive ? styles.active : ''}`}>
      <div className={styles.wormhole} style={{ transform: `scale(${progress * 2})` }}>
        <div className={styles.wormholeRing} style={{ animationDuration: '2s' }}></div>
        <div className={styles.wormholeRing} style={{ animationDuration: '1.8s', animationDelay: '0.1s' }}></div>
        <div className={styles.wormholeRing} style={{ animationDuration: '1.6s', animationDelay: '0.2s' }}></div>
        <div className={styles.wormholeRing} style={{ animationDuration: '1.4s', animationDelay: '0.3s' }}></div>
        <div className={styles.wormholeCenter}></div>
      </div>
      
      <div className={styles.destinationLabel} style={{ opacity: progress > 0.5 ? (progress - 0.5) * 2 : 0 }}>
        Accessing {destination}...
      </div>
      
      <div className={styles.particles}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className={styles.particle}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 1}s`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default WormholeTransition;