'use client';

import { useState, useEffect, useRef } from 'react';
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation';
import { useParallaxEffect } from '@/hooks/useParallaxEffect';
import QuantumParticleSystem from '../QuantumParticleSystem/QuantumParticleSystem';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  onJoinClick: () => void;
}

interface ParticleProps {
  top: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
  width: string;
  height: string;
  opacity: number;
}

const HeroSection = ({ onJoinClick }: HeroSectionProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [particlesActive, setParticlesActive] = useState(false);
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const isInView = useIntersectionAnimation(heroRef, { threshold: 0, triggerOnce: true });
  const { offset } = useParallaxEffect(heroRef, { factor: 0.05 });
  
  // Generate particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${5 + Math.random() * 7}s`,
      width: `${2 + Math.random() * 6}px`,
      height: `${2 + Math.random() * 6}px`,
      opacity: 0.1 + Math.random() * 0.4
    }));
    
    setParticles(newParticles);
  }, []);
  
  // Animation loading effect
  useEffect(() => {
    // Set a slight delay for the initial animation
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    
    // Add a delay for particle effects to start
    const particlesTimer = setTimeout(() => {
      setParticlesActive(true);
    }, 1500);
    
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(particlesTimer);
    };
  }, []);

  // Dynamic style for parallax effect
  const parallaxStyle = {
    transform: `translateY(${offset}px)`
  };

  return (
    <section 
      ref={heroRef}
      className={`${styles.hero} ${styles.quantumVisualization} ${isLoaded ? styles.loaded : ''}`}
      aria-labelledby="hero-heading"
    >
      <QuantumParticleSystem 
        particleCount={40} 
        particleColor="#00ff66" 
        connectionDistance={180}
        interactive={true}
      />

      <div className={styles.container}>
        <div className={styles.heroContent} style={parallaxStyle}>
          <div className={`${styles.heroBadge} ${styles.pulseAnimation}`} aria-hidden="true">
            <span className={styles.badgeIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
              </svg>
            </span>
            <span>Limited Early Access Available</span>
          </div>
          
          <h1 id="hero-heading" className={styles.quantumTransition}>
            Experience the <span className={styles.highlight}>Quantum</span> Revolution
          </h1>
          
          <p className={styles.heroSubtitle}>
            Join our exclusive early access program and be among the first to harness the power of quantum technology with a <span className={styles.textHighlight}>99.9998% success rate</span>.
          </p>
          
          <div className={styles.heroFeatures}>
            <div className={styles.heroFeature}>
              <div className={styles.featureIcon} aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span>Unparalleled Speed</span>
            </div>
            <div className={styles.heroFeature}>
              <div className={styles.featureIcon} aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <span>Quantum Security</span>
            </div>
            <div className={styles.heroFeature}>
              <div className={styles.featureIcon} aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <span>Real-time Analysis</span>
            </div>
          </div>
          
          <div className={styles.ctaGroup}>
            <button 
              className={`${styles.ctaButton} ${styles.btnQuantum}`} 
              onClick={onJoinClick}
              aria-label="Get Early Access to PROSPERA"
            >
              Get Early Access
              <div className={styles.btnGlow}></div>
            </button>
            <a 
              href="#features" 
              className={styles.secondaryButton}
              aria-label="Learn more about PROSPERA features"
            >
              Learn More
            </a>
          </div>
          
          <div className={styles.statsBar}>
            <div className={styles.statsItem}>
              <div className={styles.statsValue}>$4.1T</div>
              <div className={styles.statsLabel}>Market Disruption</div>
            </div>
            <div className={styles.statsDivider} aria-hidden="true"></div>
            <div className={styles.statsItem}>
              <div className={styles.statsValue}>99.9998%</div>
              <div className={styles.statsLabel}>Success Rate</div>
            </div>
            <div className={styles.statsDivider} aria-hidden="true"></div>
            <div className={styles.statsItem}>
              <div className={styles.statsValue}>15,000+</div>
              <div className={styles.statsLabel}>Validation Layers</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.quantumParticles} aria-hidden="true">
        {particlesActive && particles.map((particle, index) => (
          <div
            key={`particle-${index}`}
            className={`${styles.quantumParticle} ${particlesActive ? styles.active : ''}`}
            style={{
              top: particle.top,
              left: particle.left,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
              width: particle.width,
              height: particle.height,
              opacity: particle.opacity
            }}
          />
        ))}
      </div>
      
      <div className={styles.heroDecoration} aria-hidden="true">
        <div className={styles.glowOrb}></div>
        <div className={styles.gridLines}></div>
      </div>
    </section>
  );
};

export default HeroSection;