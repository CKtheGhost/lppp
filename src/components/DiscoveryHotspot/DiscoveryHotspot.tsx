// src/components/DiscoveryHotspot/DiscoveryHotspot.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './DiscoveryHotspot.module.css';

export interface DigitalCodeParticle {
  x: number;
  y: number;
  char: string;
  opacity: number;
  speed: number;
  lifespan: number;
  age: number;
}

export interface DiscoveryHotspotProps {
  id: string;
  position: { x: number; y: number };
  pulseColor?: string;
  glowColor?: string;
  size?: number;
  label?: string;
  secondaryLabel?: string;
  onDiscover?: () => void;
  discovered?: boolean;
  showCodeEffect?: boolean;
  activeParticles?: number;
  initialDelay?: number;
  theme?: 'green' | 'blue' | 'purple' | 'red' | 'cyan' | 'multi';
  onWormholeTriggered?: (destination: string) => void;
}

const DiscoveryHotspot: React.FC<DiscoveryHotspotProps> = ({
  id,
  position = { x: 50, y: 50 },
  pulseColor = '#00ff00',
  glowColor = '#00ff00',
  size = 100,
  label = 'Neural Node',
  secondaryLabel = 'Access restricted',
  onDiscover,
  discovered = false,
  showCodeEffect = true,
  activeParticles = 20,
  initialDelay = 0,
  theme = 'green',
  onWormholeTriggered
}) => {
  // State management
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDiscoveringActive, setIsDiscoveringActive] = useState(false);
  const [codeParticles, setCodeParticles] = useState<DigitalCodeParticle[]>([]);
  const [showLabel, setShowLabel] = useState(false);
  
  // Refs for performance optimization
  const containerRef = useRef<HTMLDivElement>(null);
  const hotspotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Matrix characters for code effect - more comprehensive and varied
  const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=<>[]{}|~^%#@!?;:,.ΨΦΩαβγδεζηθικλμνξπρστυφχψω∞∫∂∇∑∏√∛∜∝∞".split('');
  
  // Theme colors with enhanced color palettes
  const themeColors = {
    green: {
      primary: '#00ff00',
      secondary: '#00cc44',
      glow: 'rgba(0, 255, 0, 0.8)',
      text: '#ccffcc'
    },
    blue: {
      primary: '#0088ff',
      secondary: '#00ccff',
      glow: 'rgba(0, 136, 255, 0.8)',
      text: '#ccf5ff'
    },
    purple: {
      primary: '#aa00ff',
      secondary: '#cc66ff',
      glow: 'rgba(170, 0, 255, 0.8)',
      text: '#eeccff'
    },
    red: {
      primary: '#ff3311',
      secondary: '#ff6644',
      glow: 'rgba(255, 51, 17, 0.8)',
      text: '#ffcccc'
    },
    cyan: {
      primary: '#00ffff',
      secondary: '#66ffff',
      glow: 'rgba(0, 255, 255, 0.8)',
      text: '#ccffff'
    },
    multi: {
      primary: '#00ff00',
      secondary: '#00ccff',
      glow: 'rgba(0, 255, 102, 0.8)',
      text: '#ffffff'
    }
  };
  
  // Get colors based on theme or custom colors - memoized for performance
  const getColor = useCallback((type: 'primary' | 'secondary' | 'glow' | 'text') => {
    const colors = themeColors[theme];
    
    if (type === 'glow' && glowColor) {
      return glowColor;
    }
    
    if (type === 'primary' && pulseColor) {
      return pulseColor;
    }
    
    return colors[type];
  }, [theme, glowColor, pulseColor]);
  
  // Initial setup and visibility with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, Math.random() * 1000 + initialDelay);
    
    return () => clearTimeout(timer);
  }, [initialDelay]);
  
  // Set active state if already discovered
  useEffect(() => {
    if (discovered) {
      setIsActive(true);
      setHasAnimated(true);
    }
  }, [discovered]);
  
  // Setup canvas for code effect only when needed
  useEffect(() => {
    if (!canvasRef.current || !showCodeEffect) return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!container) return;
    
    // Set canvas with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * 2 * dpr;
    canvas.height = size * 2 * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    
    // Initial code particles
    if (isVisible && (isHovered || isActive)) {
      initCodeParticles();
    }
  }, [size, showCodeEffect, isVisible, isHovered, isActive]);
  
  // Initialize code particles
  const initCodeParticles = useCallback(() => {
    const newParticles: DigitalCodeParticle[] = [];
    const particleCount = activeParticles;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * size * 0.8;
      
      newParticles.push({
        x: Math.cos(angle) * distance + size,
        y: Math.sin(angle) * distance + size,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        opacity: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 1.5 + 0.5,
        lifespan: Math.random() * 60 + 30,
        age: 0
      });
    }
    
    setCodeParticles(newParticles);
  }, [activeParticles, size, matrixChars]);
  
  // Animate code particles with optimized performance
  useEffect(() => {
    if (!canvasRef.current || !showCodeEffect || codeParticles.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    let lastTimestamp = 0;
    
    const animate = (timestamp: number) => {
      // Calculate delta time for smooth animations
      const deltaTime = lastTimestamp ? Math.min((timestamp - lastTimestamp) / 16.667, 3) : 1;
      lastTimestamp = timestamp;
      
      // Semi-transparent clear for trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update particles with batch processing for better performance
      setCodeParticles(prevParticles => {
        // Filter out expired particles
        const aliveParticles = prevParticles.filter(p => p.age < p.lifespan);
        
        // Update remaining particles
        const updatedParticles = aliveParticles.map(particle => {
          // Move particle outward
          const angle = Math.atan2(particle.y - size, particle.x - size);
          const newX = particle.x + Math.cos(angle) * particle.speed * deltaTime;
          const newY = particle.y + Math.sin(angle) * particle.speed * deltaTime;
          
          // Calculate opacity based on age
          const lifeFactor = 1 - particle.age / particle.lifespan;
          const displayOpacity = particle.opacity * lifeFactor;
          
          // Draw character
          ctx.font = '14px "JetBrains Mono", monospace';
          ctx.fillStyle = `${getColor('primary')}${Math.floor(displayOpacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fillText(particle.char, newX, newY);
          
          // Randomly change character (10% chance)
          return {
            ...particle,
            x: newX,
            y: newY,
            age: particle.age + deltaTime,
            char: Math.random() < 0.1 
              ? matrixChars[Math.floor(Math.random() * matrixChars.length)] 
              : particle.char
          };
        });
        
        // Add new particles if needed to maintain count
        if (updatedParticles.length < activeParticles && (isHovered || isActive || isDiscoveringActive)) {
          const newParticlesNeeded = Math.min(
            activeParticles - updatedParticles.length,
            // Only add a few per frame for smooth performance
            Math.ceil(deltaTime * 2)
          );
          
          for (let i = 0; i < newParticlesNeeded; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 10; // Start near center
            
            updatedParticles.push({
              x: Math.cos(angle) * distance + size,
              y: Math.sin(angle) * distance + size,
              char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
              opacity: Math.random() * 0.5 + 0.5,
              speed: Math.random() * 1.5 + 0.5,
              lifespan: Math.random() * 60 + 30,
              age: 0
            });
          }
        }
        
        return updatedParticles;
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [codeParticles, showCodeEffect, size, isHovered, isActive, isDiscoveringActive, activeParticles, getColor, matrixChars]);
  
  // Handle hotspot click with animation sequence
  const handleClick = useCallback(() => {
    if (discovered || isDiscoveringActive) return;
    
    // Prevent multiple activations
    setIsDiscoveringActive(true);
    
    // Create more code particles for the discovery animation
    const burstParticles: DigitalCodeParticle[] = [];
    const burstCount = 30;
    
    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 10;
      
      burstParticles.push({
        x: Math.cos(angle) * distance + size,
        y: Math.sin(angle) * distance + size,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        opacity: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 2 + 1,
        lifespan: Math.random() * 60 + 40,
        age: 0
      });
    }
    
    setCodeParticles(prev => [...prev, ...burstParticles]);
    
    // Activate the animation sequence
    setIsActive(true);
    
    // Trigger wormhole effect if callback exists
    if (onWormholeTriggered) {
      onWormholeTriggered(label);
    }
    
    // After animation, mark as discovered
    setTimeout(() => {
      setHasAnimated(true);
      setIsDiscoveringActive(false);
      if (onDiscover) onDiscover();
    }, 1500);
  }, [discovered, isDiscoveringActive, size, matrixChars, onWormholeTriggered, label, onDiscover]);
  
  // Handle hover state with delay for better UX
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    // Clear any existing timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    
    // Show label after a short delay
    hoverTimerRef.current = setTimeout(() => {
      setShowLabel(true);
    }, 300);
  }, []);
  
  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    
    // Clear hover timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    
    // Hide label
    setShowLabel(false);
  }, []);
  
  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Render digital scanning line (active effect)
  const renderScanLine = () => {
    if (!isActive || hasAnimated) return null;
    
    return (
      <div className={styles.scanLineContainer}>
        <div className={styles.scanLine}></div>
      </div>
    );
  };
  
  // Render pulse rings
  const renderPulseRings = () => {
    return Array.from({ length: 3 }).map((_, i) => (
      <div 
        key={`ring-${i}`} 
        className={`${styles.pulseRing} ${discovered ? styles.discovered : ''}`}
        style={{ 
          borderColor: getColor('primary'),
          animationDelay: `${i * 0.5}s`
        }}
      />
    ));
  };
  
  // Generate CSS classes for different states
  const hotspotClasses = [
    styles.hotspot,
    isActive ? styles.active : styles.normal,
    isHovered ? styles.hovered : '',
    isActive && !hasAnimated ? styles.animating : '',
    discovered ? styles.discovered : ''
  ].filter(Boolean).join(' ');
  
  // Accessibility label
  const ariaLabel = discovered 
    ? `${label} (Discovered)` 
    : `Discover ${label}`;

  return (
    <div 
      id={id}
      ref={containerRef}
      className={`${styles.container} ${isVisible ? styles.visible : ''} ${styles[theme]}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* Code effect canvas */}
      {showCodeEffect && (
        <canvas 
          ref={canvasRef}
          className={styles.codeCanvas}
          width={size * 2}
          height={size * 2}
          aria-hidden="true"
        />
      )}
      
      {/* Hotspot area */}
      <div 
        ref={hotspotRef}
        className={hotspotClasses}
        style={{ 
          background: `radial-gradient(circle, ${getColor('glow').replace(/[\d.]+\)$/, isActive ? '0.3)' : '0.1)')}, transparent 70%)` 
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        role="button"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {/* Center dot */}
        <div 
          className={`${styles.centerDot} ${discovered ? styles.discovered : styles.normal}`}
          style={{ background: getColor('primary') }}
        >
          {/* Digital code elements */}
          <div className={styles.codeElements}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={`code-${i}`} 
                className={styles.codeElement}
                aria-hidden="true"
              >
                {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
              </div>
            ))}
          </div>
        </div>
        
        {/* Pulse rings */}
        <div className={styles.pulseRings} aria-hidden="true">
          {renderPulseRings()}
        </div>
        
        {/* Digital scan line (during activation) */}
        {renderScanLine()}
        
        {/* Glow effect */}
        <div 
          className={`${styles.glowEffect} ${isActive ? styles.active : ''}`}
          style={{ boxShadow: `0 0 20px ${getColor('glow')}` }}
          aria-hidden="true"
        ></div>
      </div>
      
      {/* Label */}
      <div 
        className={`
          ${styles.label} 
          ${(showLabel || discovered) ? styles.visible : ''} 
          ${discovered ? styles.discovered : ''}
        `}
        style={{ color: getColor('text') }}
        aria-hidden={!(showLabel || discovered)}
      >
        <div className={styles.primaryLabel}>
          {label}
          <span className={styles.accessStatus}>
            {discovered ? ' [ACCESSED]' : ' [RESTRICTED]'}
          </span>
        </div>
        
        <div className={styles.secondaryLabel}>
          {discovered ? 'Neural access granted' : secondaryLabel}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryHotspot;