'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styles from './InteractiveStellarMap.module.css';

export interface MatrixRainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  char: string;
  opacity: number;
  hue: number;
}

export interface GridNode {
  x: number;
  y: number;
  size: number;
  pulseSpeed: number;
  glowIntensity: number;
  connections: number[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  lifespan: number;
  age: number;
}

export interface InteractiveStellarMapProps {
  children: React.ReactNode;
  density?: number;
  matrixEffect?: boolean;
  matrixRainColor?: string;
  gridEnabled?: boolean;
  interactiveGlow?: boolean;
  pulseNodes?: boolean;
  theme?: 'green' | 'blue' | 'red' | 'purple' | 'cyan' | 'multi';
  interactive?: boolean;
  codeFragmentDensity?: number;
  flowDirection?: 'down' | 'up' | 'random';
  enableGlow?: boolean;
  reactToClick?: boolean;
  connectDistance?: number;
}

const InteractiveStellarMap: React.FC<InteractiveStellarMapProps> = ({
  children,
  density = 50,
  matrixRainEnabled = true,
  matrixRainColor = '#00ff00',
  gridEnabled = true,
  interactiveGlow = true,
  pulseNodes = true,
  theme = 'green',
  interactive = true
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rainCanvasRef = useRef<HTMLCanvasElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // State
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number, active: boolean }>({
    x: 0,
    y: 0,
    active: false
  });
  
  // Animation frame references
  const rainAnimationRef = useRef<number | null>(null);
  const gridAnimationRef = useRef<number | null>(null);
  const particlesAnimationRef = useRef<number | null>(null);
  const fxAnimationRef = useRef<number | null>(null);
  
  // Data references
  const matrixRainRef = useRef<MatrixRainDrop[]>([]);
  const gridNodesRef = useRef<GridNode[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastParticleTimeRef = useRef<number>(0);
  const isResizingRef = useRef<boolean>(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Matrix characters
  const matrixChars = useMemo(() => {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=<>[]{}|~^%#@!?;:,.'.split('');
  }, []);
  
  // Theme colors
  const themeColors = useMemo(() => {
    const themes = {
      green: {
        primary: '#00ff00',
        secondary: '#00cc66',
        tertiary: '#003300',
        accent: '#33ff33',
        background: '#001100'
      },
      blue: {
        primary: '#0088ff',
        secondary: '#00ccff',
        tertiary: '#000066',
        accent: '#33ccff',
        background: '#000033'
      },
      red: {
        primary: '#ff0033',
        secondary: '#cc0000',
        tertiary: '#330000',
        accent: '#ff3333',
        background: '#110000'
      },
      purple: {
        primary: '#9900ff',
        secondary: '#6600cc',
        tertiary: '#220033',
        accent: '#aa33ff',
        background: '#110022'
      },
      cyan: {
        primary: '#00ffff',
        secondary: '#00cccc',
        tertiary: '#003333',
        accent: '#33ffff',
        background: '#001111'
      },
      multi: {
        primary: '#00ff00',
        secondary: '#00ccff',
        tertiary: '#220033',
        accent: '#ff00ff',
        background: '#000022'
      }
    };
    
    return themes[theme];
  }, [theme]);
  
  // Initialize dimensions
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      // Mark as resizing to prevent animation artifacts
      isResizingRef.current = true;
      
      // Clear previous timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      // Get dimensions
      const { offsetWidth, offsetHeight } = containerRef.current;
      
      // Update dimensions state
      setDimensions({
        width: offsetWidth,
        height: offsetHeight
      });
      
      // Reset resizing flag after animations have time to adjust
      resizeTimeoutRef.current = setTimeout(() => {
        isResizingRef.current = false;
        
        // Reinitialize if already initialized
        if (isInitialized) {
          // Clean up previous animations
          cleanupAnimations();
          
          // Reinitialize with new dimensions
          initMatrixRain();
          initGrid();
        }
      }, 300);
    };
    
    handleResize();
    
    // Throttled resize handler for better performance
    let resizeTimer: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', throttledResize);
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);
  
  // Clean up animations
  const cleanupAnimations = useCallback(() => {
    [rainAnimationRef, gridAnimationRef, particlesAnimationRef, fxAnimationRef].forEach(ref => {
      if (ref.current) {
        cancelAnimationFrame(ref.current);
        ref.current = null;
      }
    });
  }, []);
  
  // Initialize the system
  useEffect(() => {
    if (!dimensions.width || !dimensions.height || isInitialized) return;
    
    // Initialize contexts
    const mainCanvas = canvasRef.current;
    const rainCanvas = rainCanvasRef.current;
    const gridCanvas = gridCanvasRef.current;
    const fxCanvas = fxCanvasRef.current;
    
    if (!mainCanvas || !rainCanvas || !gridCanvas || !fxCanvas) return;
    
    // Set dimensions with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    
    // Update all canvases with proper dimensions
    [mainCanvas, rainCanvas, gridCanvas, fxCanvas].forEach(canvas => {
      canvas.width = dimensions.width * dpr;
      canvas.height = dimensions.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    });
    
    // Initialize Matrix rain
    initMatrixRain();
    
    // Initialize Grid
    initGrid();
    
    // Mark as initialized
    setIsInitialized(true);
    
    // Set loaded with delay for transition
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    // Cleanup function
    return () => {
      cleanupAnimations();
    };
  }, [dimensions, isInitialized, cleanupAnimations]);
  
  // Initialize Matrix rain
  const initMatrixRain = useCallback(() => {
    if (!matrixRainEnabled) return;
    
    const { width, height } = dimensions;
    const drops: MatrixRainDrop[] = [];
    
    // Calculate number of drops based on width
    const columns = Math.floor(width / 20); // One drop every ~20px
    
    for (let i = 0; i < columns; i++) {
      drops.push({
        x: i * 20 + Math.random() * 10, // Add some randomness
        y: Math.random() * -500, // Start above viewport at random positions
        length: Math.floor(Math.random() * 15) + 5,
        speed: Math.random() * 1.5 + 0.5,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        opacity: Math.random() * 0.5 + 0.3,
        hue: Math.random() * 30 // Slight hue variation
      });
    }
    
    matrixRainRef.current = drops;
  }, [dimensions, matrixChars, matrixRainEnabled]);
  
  // Initialize Grid
  const initGrid = useCallback(() => {
    if (!gridEnabled) return;
    
    const { width, height } = dimensions;
    const nodes: GridNode[] = [];
    
    // Calculate number of nodes based on density
    const nodeCount = Math.min(Math.floor(width * height / 20000 * density), 150);
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1.5,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        glowIntensity: Math.random() * 0.3 + 0.7,
        connections: []
      });
    }
    
    // Compute connections
    nodes.forEach((node, index) => {
      const connections: number[] = [];
      const maxConnections = Math.floor(Math.random() * 3) + 2;
      
      // Find closest nodes
      const distances = nodes
        .map((otherNode, otherIndex) => {
          if (otherIndex === index) return { index: otherIndex, distance: Infinity };
          
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          return { index: otherIndex, distance };
        })
        .filter(item => item.distance < 250) // Max connection distance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, maxConnections);
      
      node.connections = distances.map(d => d.index);
    });
    
    gridNodesRef.current = nodes;
  }, [dimensions, density, gridEnabled]);
  
  // Animation loop for Matrix rain
  useEffect(() => {
    if (!isInitialized || !matrixRainEnabled) return;
    
    const rainCanvas = rainCanvasRef.current;
    if (!rainCanvas) return;
    
    const ctx = rainCanvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    const animate = () => {
      // Skip animation frames during resize to improve performance
      if (isResizingRef.current) {
        rainAnimationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Set global composition for glow effect
      ctx.globalCompositeOperation = 'source-over';
      
      // Update and draw rain drops
      matrixRainRef.current.forEach((drop, index) => {
        // Update position
        drop.y += drop.speed;
        
        // Reset if out of bounds
        if (drop.y > dimensions.height) {
          drop.y = Math.random() * -200;
          drop.length = Math.floor(Math.random() * 15) + 5;
          drop.speed = Math.random() * 1.5 + 0.5;
          drop.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          drop.opacity = Math.random() * 0.5 + 0.3;
        }
        
        // Randomly change character
        if (Math.random() < 0.01) {
          drop.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        }
        
        // Draw trail
        for (let i = 0; i < drop.length; i++) {
          const y = drop.y - i * 20;
          if (y < 0) continue;
          
          // Get trail opacity - head is brightest
          const trailOpacity = drop.opacity * (1 - i / drop.length);
          
          // Color based on position in trail
          const color = i === 0
            ? `rgba(180, 255, 180, ${drop.opacity + 0.3})`
            : `hsla(${120 + drop.hue}, 100%, ${50 - i * 3}%, ${trailOpacity})`;
          
          ctx.font = '16px "JetBrains Mono", monospace';
          ctx.fillStyle = color;
          ctx.fillText(
            i === 0 ? drop.char : matrixChars[Math.floor(Math.random() * matrixChars.length)],
            drop.x,
            y
          );
        }
      });
      
      rainAnimationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (rainAnimationRef.current) {
        cancelAnimationFrame(rainAnimationRef.current);
      }
    };
  }, [isInitialized, matrixRainEnabled, dimensions, matrixChars]);
  
  // Animation loop for Grid
  useEffect(() => {
    if (!isInitialized || !gridEnabled) return;
    
    const gridCanvas = gridCanvasRef.current;
    if (!gridCanvas) return;
    
    const ctx = gridCanvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    const animate = (timestamp: number) => {
      // Skip animation frames during resize to improve performance
      if (isResizingRef.current) {
        gridAnimationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Set line properties
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      
      // Draw connections first (behind nodes)
      gridNodesRef.current.forEach((node, index) => {
        node.connections.forEach(connectionIndex => {
          const targetNode = gridNodesRef.current[connectionIndex];
          
          // Calculate distance to determine opacity
          const dx = node.x - targetNode.x;
          const dy = node.y - targetNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 250;
          
          // Skip if too far
          if (distance > maxDistance) return;
          
          // Calculate line opacity based on distance
          const lineOpacity = 0.1 + 0.1 * (1 - distance / maxDistance);
          
          // Create gradient for line
          const gradient = ctx.createLinearGradient(
            node.x, node.y, 
            targetNode.x, targetNode.y
          );
          
          gradient.addColorStop(0, `rgba(${hexToRgb(themeColors.primary)}, ${lineOpacity * node.glowIntensity})`);
          gradient.addColorStop(1, `rgba(${hexToRgb(themeColors.secondary)}, ${lineOpacity * targetNode.glowIntensity})`);
          
          ctx.strokeStyle = gradient;
          
          // Draw line
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();
        });
      });
      
      // Draw nodes
      gridNodesRef.current.forEach((node, index) => {
        // Update pulse if enabled
        if (pulseNodes) {
          node.glowIntensity = 0.7 + 0.3 * Math.sin(timestamp * node.pulseSpeed);
        }
        
        // Draw node glow
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size * 8
        );
        
        gradient.addColorStop(0, `rgba(${hexToRgb(themeColors.primary)}, ${0.3 * node.glowIntensity})`);
        gradient.addColorStop(1, `rgba(${hexToRgb(themeColors.primary)}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.arc(node.x, node.y, node.size * 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw node
        ctx.beginPath();
        ctx.fillStyle = themeColors.primary;
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      gridAnimationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      if (gridAnimationRef.current) {
        cancelAnimationFrame(gridAnimationRef.current);
      }
    };
  }, [isInitialized, gridEnabled, dimensions, pulseNodes, themeColors]);
  
  // Handle mouse interactions
  useEffect(() => {
    if (!isInitialized || !interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePosition({
        x,
        y,
        active: true
      });
      
      // Spawn particles with throttling for better performance
      spawnParticles(x, y, 1);
    };
    
    const handleMouseLeave = () => {
      setMousePosition({
        ...mousePosition,
        active: false
      });
    };
    
    const handleMouseClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      console.log('Stellar map clicked at:', x, y);
      
      // Spawn more particles on click
      spawnParticles(x, y, 10);
      
      // Add interactive matrix effect on click
      if (matrixRainEnabled) {
        const additionalDrops = 10;
        
        for (let i = 0; i < additionalDrops; i++) {
          matrixRainRef.current.push({
            x: x + Math.random() * 100 - 50,
            y: y,
            length: Math.floor(Math.random() * 15) + 5,
            speed: Math.random() * 1.5 + 0.5,
            char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
            opacity: Math.random() * 0.7 + 0.5,
            hue: Math.random() * 30
          });
        }
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('click', handleMouseClick);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('click', handleMouseClick);
      }
    };
  }, [isInitialized, interactive, mousePosition, matrixRainEnabled, matrixChars]);
  
  // Spawn particles with throttling
  const spawnParticles = useCallback((x: number, y: number, count: number) => {
    // Limit particle spawn rate
    const now = Date.now();
    if (now - lastParticleTimeRef.current < 50) return;
    lastParticleTimeRef.current = now;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        color: theme === 'multi' 
          ? `hsl(${Math.random() * 60 + 90}, 100%, 60%)`
          : themeColors.primary,
        lifespan: Math.random() * 30 + 20,
        age: 0
      });
    }
  }, [theme, themeColors.primary]);
  
  // Animation loop for Particles
  useEffect(() => {
    if (!isInitialized) return;
    
    const mainCanvas = canvasRef.current;
    if (!mainCanvas) return;
    
    const ctx = mainCanvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    const animate = () => {
      // Skip animation frames during resize to improve performance
      if (isResizingRef.current) {
        particlesAnimationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Update age
        particle.age++;
        
        // Remove if too old
        if (particle.age > particle.lifespan) {
          return false;
        }
        
        // Calculate opacity based on age
        const opacity = 1 - particle.age / particle.lifespan;
        
        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = particle.color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        return true;
      });
      
      particlesAnimationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (particlesAnimationRef.current) {
        cancelAnimationFrame(particlesAnimationRef.current);
      }
    };
  }, [isInitialized, dimensions]);
  
  // Interactive glow effect
  useEffect(() => {
    if (!isInitialized || !interactiveGlow) return;
    
    const fxCanvas = fxCanvasRef.current;
    if (!fxCanvas) return;
    
    const ctx = fxCanvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    const animate = () => {
      // Skip animation frames during resize to improve performance
      if (isResizingRef.current) {
        fxAnimationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Only draw when mouse is active
      if (mousePosition.active) {
        const { x, y } = mousePosition;
        
        // Create radial gradient for glow
        const gradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, 200
        );
        
        gradient.addColorStop(0, `rgba(${hexToRgb(themeColors.primary)}, 0.15)`);
        gradient.addColorStop(1, `rgba(${hexToRgb(themeColors.primary)}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 200, 0, Math.PI * 2);
        ctx.fill();
      }
      
      fxAnimationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (fxAnimationRef.current) {
        cancelAnimationFrame(fxAnimationRef.current);
      }
    };
  }, [isInitialized, dimensions, mousePosition, interactiveGlow, themeColors]);
  
  // Utility function to convert hex to rgb
  const hexToRgb = useCallback((hex: string) => {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return `${r}, ${g}, ${b}`;
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${isLoaded ? styles.active : ''} ${styles[theme]}`}
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100vh',
        zIndex: 10,
        pointerEvents: 'auto'
      }}
    >
      {/* Matrix Rain Canvas */}
      <canvas 
        ref={rainCanvasRef}
        className={styles.canvas}
        width={dimensions.width} 
        height={dimensions.height}
      />
      
      {/* Grid Canvas */}
      <canvas 
        ref={gridCanvasRef}
        className={styles.canvas}
        width={dimensions.width} 
        height={dimensions.height}
      />
      
      {/* Main Particles Canvas */}
      <canvas 
        ref={canvasRef}
        className={styles.canvas}
        width={dimensions.width} 
        height={dimensions.height}
      />
      
      {/* Interactive Effects Canvas */}
      <canvas 
        ref={fxCanvasRef}
        className={styles.canvas}
        width={dimensions.width} 
        height={dimensions.height}
      />
      
      {/* Content (Hotspots, etc.) */}
      <div className={styles.content} style={{ pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

export default InteractiveStellarMap;