'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import styles from './QuantumSpinner.module.css';

export interface QuantumSpinnerProps {
  size?: number;
  theme?: 'green' | 'blue' | 'purple' | 'red' | 'cyan' | 'multi';
  speed?: 'slow' | 'normal' | 'fast';
  pulseIntensity?: 'low' | 'normal' | 'high';
  showParticles?: boolean;
  showLabel?: boolean;
  labelText?: string;
  showProgress?: boolean;
  progress?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  lifespan: number;
  age: number;
  color: string;
}

const QuantumSpinner: React.FC<QuantumSpinnerProps> = ({
  size = 80,
  theme = 'green',
  speed = 'normal',
  pulseIntensity = 'normal',
  showParticles = true,
  showLabel = false,
  labelText = 'Loading...',
  showProgress = false,
  progress = 0,
  className = '',
}) => {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // State
  const [rotation, setRotation] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: size, height: size });
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Animated counter for smoother progress display
  const animatedProgress = useAnimatedCounter(progress, {
    duration: 800,
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  });
  
  // Speed multiplier
  const speedMultiplier = useMemo(() => {
    switch (speed) {
      case 'slow': return 0.5;
      case 'fast': return 2;
      default: return 1;
    }
  }, [speed]);
  
  // Theme colors
  const themeColors = useMemo(() => {
    const baseColors = {
      green: {
        primary: '#00ff00',
        secondary: '#00cc44',
        glow: 'rgba(0, 255, 0, 0.7)',
      },
      blue: {
        primary: '#0088ff',
        secondary: '#00ccff',
        glow: 'rgba(0, 136, 255, 0.7)',
      },
      purple: {
        primary: '#aa00ff',
        secondary: '#cc66ff',
        glow: 'rgba(170, 0, 255, 0.7)',
      },
      red: {
        primary: '#ff3311',
        secondary: '#ff6644',
        glow: 'rgba(255, 51, 17, 0.7)',
      },
      cyan: {
        primary: '#00ffff',
        secondary: '#66ffff',
        glow: 'rgba(0, 255, 255, 0.7)',
      },
      multi: {
        primary: '#00ff00',
        secondary: '#00ccff',
        glow: 'rgba(0, 255, 102, 0.7)',
      }
    };
    
    return baseColors[theme] || baseColors.green;
  }, [theme]);
  
  // Initialize dimensions and canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas dimensions with device pixel ratio
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    
    // Initialize dimensions
    setDimensions({ width: size, height: size });
    
    // Create initial particles
    if (showParticles) {
      initParticles();
    }
    
    setIsInitialized(true);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, showParticles]);
  
  // Initialize particles
  const initParticles = () => {
    const particleCount = Math.max(5, Math.floor(size / 10));
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      // Create particles around the center with random direction
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (size / 3);
      const x = size / 2 + Math.cos(angle) * distance;
      const y = size / 2 + Math.sin(angle) * distance;
      
      // Velocity perpendicular to radius
      const pSpeed = (Math.random() * 0.3 + 0.1) * speedMultiplier;
      const vx = -Math.sin(angle) * pSpeed;
      const vy = Math.cos(angle) * pSpeed;
      
      newParticles.push({
        x,
        y,
        vx,
        vy,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        lifespan: Math.random() * 100 + 50,
        age: 0,
        color: theme === 'multi' 
          ? `hsl(${Math.random() * 120 + 90}, 100%, 70%)`
          : themeColors.primary
      });
    }
    
    setParticles(newParticles);
  };
  
  // Animation loop
  useEffect(() => {
    if (!isInitialized || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const animate = () => {
      // Clear canvas with slight transparency for trails
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Update rotation
      setRotation(prev => (prev + 0.01 * speedMultiplier) % (Math.PI * 2));
      
      // Update particles
      if (showParticles) {
        setParticles(prev => {
          return prev.map(particle => {
            // Update position
            const x = particle.x + particle.vx;
            const y = particle.y + particle.vy;
            
            // Age the particle
            const age = particle.age + 1;
            
            // Remove if too old or out of bounds
            if (age > particle.lifespan || 
                x < 0 || x > dimensions.width || 
                y < 0 || y > dimensions.height) {
              
              // Replace with a new particle
              const angle = Math.random() * Math.PI * 2;
              const distance = (size / 4) * (0.8 + Math.sin(rotation * 3) * 0.2);
              
              return {
                x: size / 2 + Math.cos(angle) * distance,
                y: size / 2 + Math.sin(angle) * distance,
                vx: Math.cos(angle + Math.PI/2) * (Math.random() * 0.3 + 0.1) * speedMultiplier,
                vy: Math.sin(angle + Math.PI/2) * (Math.random() * 0.3 + 0.1) * speedMultiplier,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                lifespan: Math.random() * 100 + 50,
                age: 0,
                color: theme === 'multi' 
                  ? `hsl(${Math.random() * 120 + 90}, 100%, 70%)`
                  : themeColors.primary
              };
            }
            
            // Calculate opacity based on lifecycle
            const lifeCycleProgress = age / particle.lifespan;
            let currentOpacity = particle.opacity;
            
            if (lifeCycleProgress < 0.2) {
              // Fade in
              currentOpacity = (lifeCycleProgress / 0.2) * particle.opacity;
            } else if (lifeCycleProgress > 0.8) {
              // Fade out
              currentOpacity = ((1 - lifeCycleProgress) / 0.2) * particle.opacity;
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.fillStyle = particle.color.replace(
              /rgb|rgba/, 
              (match) => match === 'rgb' ? 'rgba' : 'rgba'
            ).replace(
              /\)/, 
              `, ${currentOpacity})`
            );
            ctx.arc(x, y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow effect
            ctx.beginPath();
            const glowGradient = ctx.createRadialGradient(
              x, y, 0,
              x, y, particle.size * 3
            );
            
            glowGradient.addColorStop(0, particle.color.replace(
              /rgb|rgba/, 
              (match) => match === 'rgb' ? 'rgba' : 'rgba'
            ).replace(
              /\)/, 
              `, ${currentOpacity * 0.5})`
            ));
            glowGradient.addColorStop(1, particle.color.replace(
              /rgb|rgba/, 
              (match) => match === 'rgb' ? 'rgba' : 'rgba'
            ).replace(
              /\)/, 
              `, 0)`
            ));
            
            ctx.fillStyle = glowGradient;
            ctx.arc(x, y, particle.size * 3, 0, Math.PI * 2);
            ctx.fill();
            
            return {
              ...particle,
              x,
              y,
              age
            };
          });
        });
      }
      
      // Apply rotation to ring
      if (ringRef.current) {
        ringRef.current.style.transform = `rotate(${rotation}rad)`;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, isInitialized, showParticles, speedMultiplier, size, theme, themeColors.primary, rotation]);
  
  // Get speed and intensity class names
  const speedClass = useMemo(() => {
    switch (speed) {
      case 'slow': return styles.speedSlow;
      case 'fast': return styles.speedFast;
      default: return '';
    }
  }, [speed]);
  
  const intensityClass = useMemo(() => {
    switch (pulseIntensity) {
      case 'low': return styles.intensityLow;
      case 'high': return styles.intensityHigh;
      default: return '';
    }
  }, [pulseIntensity]);
  
  // Style classes
  const containerClass = `${styles.spinnerContainer} ${className}`;
  const spinnerClass = styles.spinner;
  const themeClass = styles[theme];
  const ringClass = `${styles.ring} ${speedClass}`;
  const coreClass = `${styles.core} ${speedClass} ${intensityClass}`;
  
  return (
    <div 
      className={containerClass} 
      style={{ width: `${size}px`, height: `${size}px` }} 
      role="status" 
      aria-label="Loading"
    >
      <div className={`${spinnerClass} ${themeClass}`} style={{ width: `${size}px`, height: `${size}px` }}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        
        <div ref={ringRef} className={ringClass}>
          <div className={styles.ringMask} />
        </div>
        
        <div className={styles.innerCircle}>
          <div className={coreClass} />
        </div>
        
        {showProgress && (
          <div className={styles.progressText} style={{ fontSize: `${Math.max(12, size * 0.2)}px` }}>
            {Math.round(animatedProgress)}%
          </div>
        )}
      </div>
      
      {showLabel && (
        <div className={styles.label} style={{ fontSize: `${Math.max(12, size * 0.14)}px` }}>
          {labelText}
        </div>
      )}
    </div>
  );
};

export default QuantumSpinner;