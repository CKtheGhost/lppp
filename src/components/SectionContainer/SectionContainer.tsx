'use client';

import React, { useEffect, useRef } from 'react';
import styles from './SectionContainer.module.css';

interface SectionContainerProps {
  id: string;
  title: string;
  theme?: 'green' | 'blue' | 'purple' | 'red' | 'cyan' | 'multi';
  isVisible: boolean;
  children: React.ReactNode;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  id,
  title,
  theme = 'green',
  isVisible,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isVisible && containerRef.current) {
      // Scroll to section when it becomes visible
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <section 
      id={id}
      ref={containerRef}
      className={`${styles.sectionContainer} ${styles[theme]} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.contentContainer}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleText}>{title}</span>
          <div className={styles.titleLine}></div>
        </h2>
        
        <div className={styles.sectionContent}>
          {children}
        </div>
      </div>
      
      <div className={styles.visualEffects}>
        <div className={styles.gridLines}></div>
        <div className={styles.glowOrb}></div>
        <div className={styles.vignette}></div>
        
        {/* Neural particles */}
        <div className={styles.neuralParticles}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i}
              className={styles.neuralParticle}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 15}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionContainer;