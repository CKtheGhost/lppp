'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { PROSPERA_PERFORMANCE } from '@/utils/performanceUtils';
import { LoadingProvider } from '@/context/LoadingContext';

// Dynamic background effect component with optimized rendering
function MatrixBackground({ active = true }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    // Performance mark for analytics
    PROSPERA_PERFORMANCE.mark('matrixBackgroundInit');
    
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Setup canvas animation for matrix rain effect
  useEffect(() => {
    if (!canvasRef.current || !active || dimensions.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Matrix rain characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-=<>[]{}#@!?;:.';
    
    // Matrix rain drops
    const raindrops: {
      x: number;
      y: number;
      speed: number;
      length: number;
      char: string;
    }[] = [];
    
    // Initialize raindrops
    const columns = Math.floor(dimensions.width / 20);
    for (let i = 0; i < columns; i++) {
      raindrops.push({
        x: i * 20,
        y: Math.random() * dimensions.height * -1,
        speed: Math.random() * 1.5 + 0.5,
        length: Math.floor(Math.random() * 15) + 5,
        char: chars[Math.floor(Math.random() * chars.length)]
      });
    }
    
    // Animation loop
    const animate = () => {
      // Semi-transparent clear for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Draw and update raindrops
      ctx.fillStyle = '#00ff00';
      ctx.font = '15px "JetBrains Mono", monospace';
      
      raindrops.forEach(drop => {
        // Draw current character
        ctx.fillText(drop.char, drop.x, drop.y);
        
        // Update position
        drop.y += drop.speed;
        
        // Reset if out of bounds
        if (drop.y > dimensions.height) {
          drop.y = Math.random() * dimensions.height * -1;
          drop.x = Math.floor(Math.random() * dimensions.width);
          drop.speed = Math.random() * 1.5 + 0.5;
          drop.length = Math.floor(Math.random() * 15) + 5;
        }
        
        // Randomly change character
        if (Math.random() < 0.02) {
          drop.char = chars[Math.floor(Math.random() * chars.length)];
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    PROSPERA_PERFORMANCE.mark('matrixBackgroundReady');
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, dimensions]);
  
  return (
    <div className="matrix-background" aria-hidden="true">
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.3,
        }}
      />
      <div className="noise-overlay"></div>
      <div className="scanlines"></div>
      <div className="vignette"></div>
      <div className="grid-overlay"></div>
      <div className="glow-effect"></div>
    </div>
  );
}

// Enhanced boot animation with dynamic content
function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [bootStep, setBootStep] = useState(0);
  const bootLines = [
    'SYSTEM BOOT: PROSPERA_OS v4.5.7',
    'INITIALIZING QUANTUM CORES... [SUCCESS]',
    'VALIDATING NEURAL NETWORKS... [SUCCESS]',
    'ESTABLISHING DIMENSIONAL MATRICES... [SUCCESS]',
    'CALIBRATING CONSCIOUSNESS INTERFACE... [SUCCESS]',
    'ACTIVATING QUANTUM ENTANGLEMENT... [SUCCESS]',
    'NEURAL SYSTEM ONLINE',
  ];
  
  useEffect(() => {
    const bootSequence = async () => {
      // Mark performance
      PROSPERA_PERFORMANCE.mark('bootSequenceStart');
      
      // Staggered boot sequence
      for (let i = 0; i <= bootLines.length; i++) {
        await new Promise(r => setTimeout(r, i === 0 ? 500 : 700));
        setBootStep(i);
        
        // Complete boot sequence
        if (i === bootLines.length) {
          await new Promise(r => setTimeout(r, 1000));
          PROSPERA_PERFORMANCE.mark('bootSequenceComplete');
          onComplete();
        }
      }
    };
    
    bootSequence();
  }, [onComplete, bootLines.length]);
  
  return (
    <div className="boot-sequence">
      <div className="system-boot">
        {bootLines.map((line, index) => (
          <div 
            key={index} 
            className={`boot-line ${index < bootStep ? 'visible' : ''}`}
            style={{ 
              opacity: index < bootStep ? 1 : 0,
              transform: index < bootStep ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${index * 0.1}s` 
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: ReactNode
}) {
  const [isBooting, setIsBooting] = useState(true);
  const [systemReady, setSystemReady] = useState(false);
  
  // Handle boot sequence completion
  const handleBootComplete = () => {
    // Add loading class for child components loading
    if (typeof document !== 'undefined') {
      document.body.classList.add('loading');
    }
    
    // Delay to allow for smooth transition
    setTimeout(() => {
      setIsBooting(false);
      setTimeout(() => {
        setSystemReady(true);
        // Remove loading class when complete
        if (typeof document !== 'undefined') {
          document.body.classList.remove('loading');
        }
        // Dispatch event for other components to listen to
        window.dispatchEvent(new Event('prosperaLoaded'));
        PROSPERA_PERFORMANCE.mark('systemReady');
        PROSPERA_PERFORMANCE.hideLoadingOverlay(0);
      }, 600);
    }, 1000);
  };
  
  // Initialize system event listeners and integrations
  useEffect(() => {
    // Mark initial load performance
    PROSPERA_PERFORMANCE.mark('layoutMounted');
    
    // Handle system ready event
    const handleSystemReady = () => {
      console.log('PROSPERA Neural System Ready');
    };
    
    window.addEventListener('prosperaLoaded', handleSystemReady);
    
    return () => {
      window.removeEventListener('prosperaLoaded', handleSystemReady);
    };
  }, []);

  // Add system-ready class to document root when ready
  useEffect(() => {
    if (systemReady && typeof document !== 'undefined') {
      document.documentElement.classList.add('system-ready');
    }
  }, [systemReady]);

  return (
    <LoadingProvider>
      {/* Matrix background with dynamic effects */}
      <MatrixBackground active={systemReady} />
      
      {/* Boot sequence overlay */}
      <div className={`terminal-initialization ${isBooting ? '' : 'hidden'}`}>
        <BootSequence onComplete={handleBootComplete} />
      </div>
      
      {/* Main content container */}
      <div className={`content-container ${systemReady ? 'active' : ''}`}>
        {children}
      </div>
    </LoadingProvider>
  );
}