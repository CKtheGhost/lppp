'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './QuantumParticleSystem.module.css';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
  connected: boolean;
}

interface QuantumParticleSystemProps {
  particleCount?: number;
  maxConnections?: number;
  connectionDistance?: number;
  particleSpeed?: number;
  particleColor?: string;
  reduceMotion?: boolean;
}

const QuantumParticleSystem = ({
  particleCount = 50,
  maxConnections = 3,
  connectionDistance = 150,
  particleSpeed = 0.5,
  particleColor = '#00ff00',
  reduceMotion = false,
}: QuantumParticleSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const animationFrameId = useRef<number>();
  const prefersReducedMotion = useRef(reduceMotion);
  
  // Check for user preference regarding reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches || reduceMotion;
    
    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
      
      // If reduced motion is preferred, reduce particle count and stop animation
      if (e.matches) {
        setParticles(currentParticles => currentParticles.slice(0, Math.min(20, currentParticles.length)));
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [reduceMotion]);
  
  // Initialize particles
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    setDimensions({ width, height });
    
    // Create particles based on preference
    const count = prefersReducedMotion.current ? Math.min(20, particleCount) : particleCount;
    const initialParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      initialParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * particleSpeed,
        speedY: (Math.random() - 0.5) * particleSpeed,
        opacity: 0.1 + Math.random() * 0.3,
        hue: Math.random() * 30 - 15, // Slight hue variation
        connected: false,
      });
    }
    
    setParticles(initialParticles);
    
    // Add animation delay for initial render
    setTimeout(() => {
      setIsActive(true);
    }, 500);
    
    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const newWidth = rect.width;
      const newHeight = rect.height;
      
      setDimensions({ width: newWidth, height: newHeight });
      
      // Adjust particle positions to stay within bounds
      setParticles(currentParticles => 
        currentParticles.map(particle => ({
          ...particle,
          x: (particle.x / dimensions.width) * newWidth,
          y: (particle.y / dimensions.height) * newHeight
        }))
      );
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [particleCount, particleSpeed]);
  
  // Mouse interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    
    if (canvasRef.current) {
      canvasRef.current.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);
  
  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || !isActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Adjust canvas resolution for HiDPI displays
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * devicePixelRatio;
    canvas.height = dimensions.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Skip animation if user prefers reduced motion
      if (!prefersReducedMotion.current) {
        // Update particles
        setParticles(currentParticles => 
          currentParticles.map(particle => {
            // Calculate new position
            let newX = particle.x + particle.speedX;
            let newY = particle.y + particle.speedY;
            
            // Bounce off edges
            if (newX < 0 || newX > dimensions.width) {
              particle.speedX = -particle.speedX;
              newX = particle.x + particle.speedX;
            }
            
            if (newY < 0 || newY > dimensions.height) {
              particle.speedY = -particle.speedY;
              newY = particle.y + particle.speedY;
            }
            
            // Reset connected status
            particle.connected = false;
            
            return {
              ...particle,
              x: newX,
              y: newY,
            };
          })
        );
      }
      
      // Draw particles and connections
      drawParticlesAndConnections(ctx);
      
      // Continue animation
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [dimensions, isActive]);
  
  // Draw particles and connections
  const drawParticlesAndConnections = (ctx: CanvasRenderingContext2D) => {
    // Find connections between particles
    const connections: [Particle, Particle, number][] = [];
    
    // Draw mouse interaction if mouse is over canvas
    if (mousePos.x > 0 && mousePos.y > 0 && mousePos.x < dimensions.width && mousePos.y < dimensions.height) {
      particles.forEach(particle => {
        const distance = Math.sqrt(
          Math.pow(mousePos.x - particle.x, 2) + 
          Math.pow(mousePos.y - particle.y, 2)
        );
        
        if (distance < connectionDistance * 1.5) {
          // Draw connection to mouse
          const opacity = 1 - (distance / (connectionDistance * 1.5));
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 255, 0, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mousePos.x, mousePos.y);
          ctx.stroke();
          
          // Apply force to particle (attracted to mouse)
          if (!prefersReducedMotion.current) {
            const force = 0.05;
            const directionX = mousePos.x - particle.x;
            const directionY = mousePos.y - particle.y;
            const length = Math.sqrt(directionX * directionX + directionY * directionY);
            
            particle.speedX += (directionX / length) * force;
            particle.speedY += (directionY / length) * force;
            
            // Limit speed
            const maxSpeed = 2;
            const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (currentSpeed > maxSpeed) {
              particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
              particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
            }
          }
        }
      });
    }
    
    // Find connections between particles
    for (let i = 0; i < particles.length; i++) {
      const particleA = particles[i];
      let connectionCount = 0;
      
      for (let j = i + 1; j < particles.length; j++) {
        if (connectionCount >= maxConnections) break;
        
        const particleB = particles[j];
        const distance = Math.sqrt(
          Math.pow(particleA.x - particleB.x, 2) + 
          Math.pow(particleA.y - particleB.y, 2)
        );
        
        if (distance < connectionDistance) {
          connections.push([particleA, particleB, distance]);
          connectionCount++;
          particleA.connected = true;
          particleB.connected = true;
        }
      }
    }
    
    // Draw connections first (so they appear behind particles)
    connections.forEach(([particleA, particleB, distance]) => {
      const opacity = 1 - (distance / connectionDistance);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0, 255, 0, ${opacity * 0.2})`;
      ctx.lineWidth = 1;
      ctx.moveTo(particleA.x, particleA.y);
      ctx.lineTo(particleB.x, particleB.y);
      ctx.stroke();
    });
    
    // Draw particles
    particles.forEach(particle => {
      ctx.beginPath();
      
      // Create gradient for glow effect
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      );
      
      // Adjust color based on hue variation
      const baseColor = particle.connected ? particleColor : '#FFFFFF';
      const alpha = particle.connected ? particle.opacity * 1.5 : particle.opacity * 0.6;
      
      gradient.addColorStop(0, `rgba(0, 255, 0, ${alpha})`);
      gradient.addColorStop(1, `rgba(0, 255, 0, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Core of the particle
      ctx.beginPath();
      ctx.fillStyle = baseColor;
      ctx.globalAlpha = particle.opacity;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  };
  
  return (
    <div className={`${styles.particleContainer} ${isActive ? styles.active : ''}`}>
      <canvas 
        ref={canvasRef}
        className={styles.particleCanvas}
        style={{ width: '100%', height: '100%' }}
        aria-hidden="true"
      />
    </div>
  );
};

export default QuantumParticleSystem;