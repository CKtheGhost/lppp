// src/components/NeuralParticleSystem/NeuralParticleSystem.tsx
'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styles from './NeuralParticleSystem.module.css';

export interface NeuralParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  isNeuron: boolean;
  pulseRate: number;
  pulsePhase: number;
  connections: number[];
  dataTransfer?: {
    active: boolean;
    progress: number;
    speed: number;
    targetNodeIndex: number;
  };
}

export interface DataPacket {
  sourceIndex: number;
  targetIndex: number;
  x: number;
  y: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

export interface CodeFragment {
  x: number;
  y: number;
  speed: number;
  char: string;
  opacity: number;
  lifespan: number;
  age: number;
}

export interface NeuralParticleSystemProps {
  density?: number;
  interactive?: boolean;
  reactToClick?: boolean;
  connectDistance?: number;
  colorScheme?: 'green' | 'blue' | 'purple' | 'multi' | 'red' | 'cyan';
  matrixEffect?: boolean;
  dataTransferEffect?: boolean;
  codeFragmentDensity?: number;
  flowDirection?: 'down' | 'up' | 'random';
  pulseNodes?: boolean;
  enableGlow?: boolean;
}

const NeuralParticleSystem: React.FC<NeuralParticleSystemProps> = ({
  density = 60,
  interactive = true,
  reactToClick = true,
  connectDistance = 150,
  colorScheme = 'green',
  matrixEffect = true,
  dataTransferEffect = true,
  codeFragmentDensity = 30,
  flowDirection = 'down',
  pulseNodes = true,
  enableGlow = true
}) => {
  // Canvas and container refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  const dataCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Refs for animations and data - using useRef to avoid re-renders
  const particlesRef = useRef<NeuralParticle[]>([]);
  const dataPacketsRef = useRef<DataPacket[]>([]);
  const codeFragmentsRef = useRef<CodeFragment[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const lastClickRef = useRef({ x: 0, y: 0, time: 0 });
  
  // Animation frame refs
  const mainAnimationRef = useRef<number | null>(null);
  const matrixAnimationRef = useRef<number | null>(null);
  const dataAnimationRef = useRef<number | null>(null);
  
  // Matrix characters - memo for performance
  const matrixChars = useMemo(() => {
    const standardChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=<>[]{}|~^%#@!?;:,.".split('');
    const quantumChars = "ΨΦΩαβγδεζηθικλμνξπρστυφχψω∞∫∂∇∑∏√∛∜∝∞".split('');
    return [...standardChars, ...quantumChars.filter((_, i) => i % 3 === 0)];
  }, []);
  
  // Theme colors with enhanced color schemes
  const themeColors = useMemo(() => {
    const themes = {
      green: {
        primary: '#00ff00',
        secondary: '#00cc44',
        tertiary: '#003300',
        accent: '#33ff33',
        background: '#001100',
        data: '#ccffcc'
      },
      blue: {
        primary: '#0088ff',
        secondary: '#00ccff',
        tertiary: '#000066',
        accent: '#33ccff',
        background: '#000033',
        data: '#ccf5ff'
      },
      purple: {
        primary: '#aa00ff',
        secondary: '#cc66ff',
        tertiary: '#330066',
        accent: '#dd99ff',
        background: '#110022',
        data: '#eeccff'
      },
      red: {
        primary: '#ff3311',
        secondary: '#ff6644',
        tertiary: '#660000',
        accent: '#ff9977',
        background: '#110000',
        data: '#ffcccc'
      },
      cyan: {
        primary: '#00ffff',
        secondary: '#66ffff',
        tertiary: '#006666',
        accent: '#99ffff',
        background: '#001111',
        data: '#ccffff'
      },
      multi: {
        primary: '#00ff00',
        secondary: '#00ccff',
        tertiary: '#aa00ff',
        accent: '#ff3311',
        background: '#000022',
        data: '#ffffff'
      }
    };
    
    return themes;
  }, []);
  
  // Initialize dimensions and listeners
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const { offsetWidth, offsetHeight } = containerRef.current;
      
      // Only update if dimensions actually changed to prevent unnecessary rerenders
      setDimensions(prevDimensions => {
        if (prevDimensions.width !== offsetWidth || prevDimensions.height !== offsetHeight) {
          return { width: offsetWidth, height: offsetHeight };
        }
        return prevDimensions;
      });
    };
    
    // Set initial dimensions
    updateDimensions();
    
    // Debounce resize handler for better performance
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDimensions, 100);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);
  
  // Generate particle color based on chosen scheme - memoized for performance
  const getParticleColor = useCallback((isNeuron = false) => {
    const colors = themeColors[colorScheme];
    
    if (colorScheme === 'multi') {
      const schemes = ['green', 'blue', 'purple', 'red', 'cyan'];
      const randomScheme = schemes[Math.floor(Math.random() * schemes.length)];
      const schemeColors = themeColors[randomScheme];
      
      return isNeuron 
        ? schemeColors.primary
        : schemeColors.secondary;
    }
    
    return isNeuron ? colors.primary : colors.secondary;
  }, [colorScheme, themeColors]);
  
  // Initialize particles when dimensions change
  useEffect(() => {
    if (dimensions.width <= 0 || dimensions.height <= 0 || isInitialized) return;
    
    // Set canvas sizes with device pixel ratio for crisp rendering
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    
    // Initialize canvas contexts
    const updateCanvas = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;
      canvas.width = dimensions.width * dpr;
      canvas.height = dimensions.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };
    
    updateCanvas(canvasRef.current);
    updateCanvas(matrixCanvasRef.current);
    updateCanvas(dataCanvasRef.current);
    
    // Initialize particles and effects
    initParticles();
    
    if (matrixEffect) {
      initCodeFragments();
    }
    
    // Mark as initialized
    setIsInitialized(true);
    
    // Set loaded with delay for transition
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(loadTimer);
  }, [dimensions, matrixEffect, isInitialized]);
  
  // Initialize particles
  const initParticles = useCallback(() => {
    const { width, height } = dimensions;
    
    // Scale density based on screen size to maintain consistent appearance
    const scaleFactor = (width * height) / (1920 * 1080);
    const scaledDensity = Math.max(Math.floor(density * scaleFactor), 20);
    const count = Math.min(scaledDensity, 500); // Cap at 500 particles for performance
    
    const particles: NeuralParticle[] = [];
    
    for (let i = 0; i < count; i++) {
      const isNeuron = Math.random() < 0.15; // 15% chance to be a neuron node
      
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isNeuron ? 0.2 : 0.5), // Neurons move slower
        vy: (Math.random() - 0.5) * (isNeuron ? 0.2 : 0.5),
        radius: isNeuron ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.5,
        color: getParticleColor(isNeuron),
        opacity: isNeuron ? Math.random() * 0.3 + 0.7 : Math.random() * 0.4 + 0.2,
        isNeuron,
        pulseRate: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: [],
        dataTransfer: isNeuron ? {
          active: false,
          progress: 0,
          speed: 0,
          targetNodeIndex: -1
        } : undefined
      });
    }
    
    particlesRef.current = particles;
  }, [dimensions, density, getParticleColor]);
  
  // Initialize code fragments for matrix effect
  const initCodeFragments = useCallback(() => {
    const { width, height } = dimensions;
    
    // Scale fragments based on screen width
    const count = Math.min(Math.floor(codeFragmentDensity * width / 1920), 120);
    const fragments: CodeFragment[] = [];
    
    for (let i = 0; i < count; i++) {
      fragments.push(createCodeFragment(width));
    }
    
    codeFragmentsRef.current = fragments;
  }, [dimensions, codeFragmentDensity]);
  
  // Create a new code fragment
  const createCodeFragment = useCallback((width: number) => {
    // Start position based on flow direction
    const startY = flowDirection === 'up' 
      ? dimensions.height + Math.random() * 50 
      : -Math.random() * 50;
    
    const fragment: CodeFragment = {
      x: Math.random() * width,
      y: startY,
      speed: Math.random() * 2 + 1,
      char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
      opacity: Math.random() * 0.5 + 0.3,
      lifespan: Math.random() * 200 + 100,
      age: 0
    };
    
    return fragment;
  }, [dimensions.height, flowDirection, matrixChars]);
  
  // Create a new data packet for transfer between nodes
  const createDataPacket = useCallback((sourceIndex: number, targetIndex: number) => {
    const source = particlesRef.current[sourceIndex];
    const target = particlesRef.current[targetIndex];
    
    if (!source || !target) return null;
    
    const colors = themeColors[colorScheme];
    
    const packet: DataPacket = {
      sourceIndex,
      targetIndex,
      x: source.x,
      y: source.y,
      progress: 0,
      speed: Math.random() * 0.02 + 0.01,
      color: colors.data,
      size: Math.random() * 1.5 + 1
    };
    
    return packet;
  }, [colorScheme, themeColors]);
  
  // Handle mouse movement
  useEffect(() => {
    if (!interactive || !canvasRef.current || !isInitialized) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };
    
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    
    const handleClick = (e: MouseEvent) => {
      if (!reactToClick || !canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Limit click handling rate for better performance
      const now = Date.now();
      if (now - lastClickRef.current.time < 300) return; // Debounce clicks
      
      // Store click position and time
      lastClickRef.current = {
        x,
        y,
        time: now
      };
      
      // Create additional particles
      addParticlesAtPoint(x, y, 5);
      
      // Add code fragments at click point
      if (matrixEffect) {
        addCodeFragmentsAtPoint(x, y, 10);
      }
    };
    
    const canvas = canvasRef.current;
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, [interactive, reactToClick, matrixEffect, isInitialized]);
  
  // Add particles at a specific point
  const addParticlesAtPoint = useCallback((x: number, y: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      const isNeuron = Math.random() < 0.3; // Higher chance to be a neuron
      
      // Cap total particle count to prevent performance issues
      if (particlesRef.current.length < 500) {
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed * 0.5,
          vy: Math.sin(angle) * speed * 0.5,
          radius: isNeuron ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.5,
          color: getParticleColor(isNeuron),
          opacity: isNeuron ? Math.random() * 0.3 + 0.7 : Math.random() * 0.4 + 0.2,
          isNeuron,
          pulseRate: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
          connections: [],
          dataTransfer: isNeuron ? {
            active: false,
            progress: 0,
            speed: 0,
            targetNodeIndex: -1
          } : undefined
        });
      }
    }
  }, [getParticleColor]);
  
  // Add code fragments at a specific point
  const addCodeFragmentsAtPoint = useCallback((x: number, y: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const fragment: CodeFragment = {
        x: x + (Math.random() - 0.5) * 100,
        y,
        speed: Math.random() * 3 + 2,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        opacity: Math.random() * 0.7 + 0.5,
        lifespan: Math.random() * 150 + 50,
        age: 0
      };
      
      codeFragmentsRef.current.push(fragment);
    }
  }, [matrixChars]);
  
  // Main animation loop for particles and connections
  useEffect(() => {
    if (!canvasRef.current || !isInitialized || dimensions.width <= 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let frameCount = 0;
    let lastTimestamp = 0;
    
    const animate = (timestamp: number) => {
      // Calculate delta time for smooth animations regardless of frame rate
      const deltaTime = lastTimestamp ? (timestamp - lastTimestamp) / 16.667 : 1;
      lastTimestamp = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Only recompute connections every few frames for performance
      const shouldComputeConnections = frameCount % 3 === 0;
      
      if (shouldComputeConnections) {
        // Reset connections
        particlesRef.current.forEach(p => {
          p.connections = [];
        });
        
        // Compute connections - quadratic operation, so we optimize it
        const particles = particlesRef.current;
        const len = particles.length;
        
        for (let i = 0; i < len; i++) {
          const p = particles[i];
          
          for (let j = i + 1; j < len; j++) {
            const p2 = particles[j];
            const dx = p2.x - p.x;
            const dy = p2.y - p.y;
            
            // Using squared distance to avoid square root operation
            const distSquared = dx * dx + dy * dy;
            
            // Set connection distance based on whether it's a neuron
            const connectionDistanceSquared = (p.isNeuron || p2.isNeuron) 
              ? connectDistance * connectDistance * 2.25 // 1.5^2
              : connectDistance * connectDistance;
            
            if (distSquared < connectionDistanceSquared) {
              p.connections.push(j);
              
              // Randomly activate data transfer between neurons
              if (dataTransferEffect && p.isNeuron && p2.isNeuron && Math.random() < 0.001) {
                if (p.dataTransfer && !p.dataTransfer.active) {
                  p.dataTransfer.active = true;
                  p.dataTransfer.progress = 0;
                  p.dataTransfer.speed = Math.random() * 0.02 + 0.01;
                  p.dataTransfer.targetNodeIndex = j;
                  
                  // Create data packet
                  const packet = createDataPacket(i, j);
                  if (packet) {
                    dataPacketsRef.current.push(packet);
                  }
                }
              }
            }
          }
        }
      }
      
      // Update and draw particles
      const particles = particlesRef.current;
      const len = particles.length;
      
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        
        // Update position with delta time for consistent movement
        p.x += p.vx * deltaTime;
        p.y += p.vy * deltaTime;
        
        // Boundary checks with bounce
        if (p.x - p.radius <= 0 || p.x + p.radius >= dimensions.width) {
          p.vx = -p.vx;
          // Clamp position to prevent particles from getting stuck outside
          p.x = Math.max(p.radius, Math.min(dimensions.width - p.radius, p.x));
        }
        if (p.y - p.radius <= 0 || p.y + p.radius >= dimensions.height) {
          p.vy = -p.vy;
          p.y = Math.max(p.radius, Math.min(dimensions.height - p.radius, p.y));
        }
        
        // Mouse interaction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const distSquared = dx * dx + dy * dy;
          const maxDistance = 150;
          const maxDistanceSquared = maxDistance * maxDistance;
          
          if (distSquared < maxDistanceSquared) {
            // Distance-based force calculation (using squared distance for performance)
            const force = 0.2 * (1 - Math.sqrt(distSquared) / maxDistance);
            const angle = Math.atan2(dy, dx);
            
            // Apply force based on particle type
            if (p.isNeuron) {
              // Slight attraction for neurons
              const attractionForce = 0.05;
              p.vx += Math.cos(angle) * attractionForce * deltaTime;
              p.vy += Math.sin(angle) * attractionForce * deltaTime;
            } else {
              // Push regular particles away
              p.vx -= Math.cos(angle) * force * deltaTime;
              p.vy -= Math.sin(angle) * force * deltaTime;
            }
          }
        }
        
        // Limit velocity for stability
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = p.isNeuron ? 0.5 : 1;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
        
        // Calculate pulse effect for neurons
        let displayRadius = p.radius;
        let currentOpacity = p.opacity;
        
        if (p.isNeuron && pulseNodes) {
          const pulse = Math.sin(timestamp * p.pulseRate + p.pulsePhase);
          displayRadius = p.radius * (1 + 0.2 * pulse);
          currentOpacity = p.opacity * (0.8 + 0.2 * pulse);
        }
        
        // Draw connections before particles
        for (const j of p.connections) {
          const p2 = particles[j];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Calculate opacity based on distance
          const maxDistance = (p.isNeuron || p2.isNeuron) 
            ? connectDistance * 1.5 
            : connectDistance;
          
          let lineOpacity = 0.2 * (1 - distance / maxDistance);
          
          // Stronger connections between neurons
          if (p.isNeuron && p2.isNeuron) {
            lineOpacity *= 1.5;
          }
          
          // Create gradient for line
          const gradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
          gradient.addColorStop(0, `${p.color.replace(')', `, ${lineOpacity})`)}`);
          gradient.addColorStop(1, `${p2.color.replace(')', `, ${lineOpacity})`)}`);
          
          // Draw line
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = p.isNeuron && p2.isNeuron ? 0.5 : 0.3;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
        
        // Draw glow for neurons
        if (p.isNeuron && enableGlow) {
          const glowSize = displayRadius * 8;
          const gradient = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, glowSize
          );
          
          gradient.addColorStop(0, p.color.replace(')', `, ${currentOpacity * 0.4})`));
          gradient.addColorStop(1, p.color.replace(')', ', 0)'));
          
          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = p.color.replace(')', `, ${currentOpacity})`);
        ctx.arc(p.x, p.y, displayRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      frameCount++;
      mainAnimationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    // Cleanup
    return () => {
      if (mainAnimationRef.current) {
        cancelAnimationFrame(mainAnimationRef.current);
        mainAnimationRef.current = null;
      }
    };
  }, [isInitialized, dimensions, connectDistance, pulseNodes, enableGlow, dataTransferEffect, createDataPacket]);
  
  // Matrix code rain animation
  useEffect(() => {
    if (!isInitialized || !matrixEffect || !matrixCanvasRef.current || dimensions.width <= 0) return;
    
    const canvas = matrixCanvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    const animate = () => {
      // Apply a semi-transparent clear for trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Update fragments
      const fragments = codeFragmentsRef.current;
      const updatedFragments: CodeFragment[] = [];
      
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];
        
        // Update age
        const updatedAge = fragment.age + 1;
        
        // Check if expired
        if (updatedAge > fragment.lifespan) {
          // Instead of creating new fragments here, we'll maintain count later
          continue;
        }
        
        // Update position based on flow direction
        let updatedY = fragment.y;
        if (flowDirection === 'up') {
          updatedY -= fragment.speed;
        } else if (flowDirection === 'down') {
          updatedY += fragment.speed;
        } else { // random
          updatedY += (Math.random() > 0.5 ? 1 : -1) * fragment.speed;
        }
        
        // Skip if out of bounds
        if (updatedY < -20 || updatedY > dimensions.height + 20) {
          continue;
        }
        
        // Calculate opacity based on lifecycle
        const lifecycleRatio = updatedAge / fragment.lifespan;
        let opacity = fragment.opacity;
        
        if (lifecycleRatio < 0.2) {
          // Fade in
          opacity *= lifecycleRatio * 5;
        } else if (lifecycleRatio > 0.8) {
          // Fade out
          opacity *= (1 - (lifecycleRatio - 0.8) * 5);
        }
        
        // Draw character
        ctx.font = '14px "JetBrains Mono", monospace';
        
        // Color based on theme or multi-color
        if (colorScheme === 'multi') {
          ctx.fillStyle = `hsl(${(fragment.x * 360 / dimensions.width) % 360}, 100%, 50%, ${opacity})`;
        } else {
          ctx.fillStyle = `${themeColors[colorScheme].primary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        }
        
        ctx.fillText(fragment.char, fragment.x, updatedY);
        
        // Randomly change character
        const newChar = Math.random() < 0.05
          ? matrixChars[Math.floor(Math.random() * matrixChars.length)]
          : fragment.char;
        
        // Save updated fragment
        updatedFragments.push({
          ...fragment,
          y: updatedY,
          age: updatedAge,
          char: newChar
        });
      }
      
      // Maintain fragment count
      const targetCount = Math.min(Math.floor(codeFragmentDensity * (dimensions.width / 1920)), 100);
      
      while (updatedFragments.length < targetCount) {
        updatedFragments.push(createCodeFragment(dimensions.width));
      }
      
      codeFragmentsRef.current = updatedFragments;
      matrixAnimationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (matrixAnimationRef.current) {
        cancelAnimationFrame(matrixAnimationRef.current);
        matrixAnimationRef.current = null;
      }
    };
  }, [isInitialized, matrixEffect, dimensions, colorScheme, codeFragmentDensity, flowDirection, createCodeFragment, themeColors, matrixChars]);
  
  // Data packets animation
  useEffect(() => {
    if (!isInitialized || !dataTransferEffect || !dataCanvasRef.current || dimensions.width <= 0) return;
    
    const canvas = dataCanvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Update data packets
      const packets = dataPacketsRef.current;
      const updatedPackets: DataPacket[] = [];
      
      for (let i = 0; i < packets.length; i++) {
        const packet = packets[i];
        
        // Get source and target particles
        const source = particlesRef.current[packet.sourceIndex];
        const target = particlesRef.current[packet.targetIndex];
        
        if (!source || !target) continue;
        
        // Update progress
        const updatedProgress = packet.progress + packet.speed;
        
        // Remove if complete
        if (updatedProgress >= 1) {
          // Reset data transfer state for source
          if (source.dataTransfer) {
            source.dataTransfer.active = false;
          }
          continue;
        }
        
        // Calculate position using cubic bezier curve for arc effect
        const t = updatedProgress;
        const x1 = source.x;
        const y1 = source.y;
        const x2 = target.x;
        const y2 = target.y;
        
        // Control point offset
        const cpOffsetX = (x2 - x1) * 0.5 - (y2 - y1) * 0.5;
        const cpOffsetY = (y2 - y1) * 0.5 + (x2 - x1) * 0.5;
        
        // Control points
        const cpX = (x1 + x2) / 2 + cpOffsetX * 0.3;
        const cpY = (y1 + y2) / 2 + cpOffsetY * 0.3;
        
        // Quadratic bezier formula
        const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cpX + t * t * x2;
        const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cpY + t * t * y2;
        
        // Draw packet with glow effect
        if (enableGlow) {
          const glowGradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, packet.size * 5
          );
          
          glowGradient.addColorStop(0, `${packet.color}80`);
          glowGradient.addColorStop(1, `${packet.color}00`);
          
          ctx.beginPath();
          ctx.fillStyle = glowGradient;
          ctx.arc(x, y, packet.size * 5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw packet core
        ctx.beginPath();
        ctx.fillStyle = packet.color;
        ctx.arc(x, y, packet.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add motion blur trail
        const trailLength = 3;
        for (let j = 1; j <= trailLength; j++) {
          const trailT = Math.max(0, t - j * 0.03);
          const trailX = (1 - trailT) * (1 - trailT) * x1 + 2 * (1 - trailT) * trailT * cpX + trailT * trailT * x2;
          const trailY = (1 - trailT) * (1 - trailT) * y1 + 2 * (1 - trailT) * trailT * cpY + trailT * trailT * y2;
          
          ctx.beginPath();
          ctx.fillStyle = `${packet.color}${Math.floor((0.7 - j * 0.2) * 255).toString(16).padStart(2, '0')}`;
          ctx.arc(trailX, trailY, packet.size * (1 - j * 0.2), 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Save updated packet
        updatedPackets.push({
          ...packet,
          progress: updatedProgress
        });
      }
      
      dataPacketsRef.current = updatedPackets;
      dataAnimationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (dataAnimationRef.current) {
        cancelAnimationFrame(dataAnimationRef.current);
        dataAnimationRef.current = null;
      }
    };
  }, [isInitialized, dataTransferEffect, dimensions, enableGlow]);
  
  // Cleanup all animations on unmount
  useEffect(() => {
    return () => {
      [mainAnimationRef, matrixAnimationRef, dataAnimationRef].forEach(ref => {
        if (ref.current) {
          cancelAnimationFrame(ref.current);
          ref.current = null;
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${isLoaded ? styles.active : ''} ${styles[colorScheme]}`}
      aria-hidden="true" // Hidden from screen readers as this is decorative
    >
      {/* Main canvas for particles and connections */}
      <canvas 
        ref={canvasRef} 
        className={styles.canvas}
        width={dimensions.width} 
        height={dimensions.height}
      />
      
      {/* Canvas for matrix code effect */}
      {matrixEffect && (
        <canvas 
          ref={matrixCanvasRef} 
          className={`${styles.canvas} ${styles.matrixCanvas}`}
          width={dimensions.width} 
          height={dimensions.height}
        />
      )}
      
      {/* Canvas for data transfer effect */}
      {dataTransferEffect && (
        <canvas 
          ref={dataCanvasRef} 
          className={`${styles.canvas} ${styles.dataCanvas}`}
          width={dimensions.width} 
          height={dimensions.height}
        />
      )}
    </div>
  );
};

export default NeuralParticleSystem;