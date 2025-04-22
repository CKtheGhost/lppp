'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './QuantumParticleSystem.module.css';

interface QuantumParticleSystemProps {
  particleCount?: number;
  connectionDistance?: number;
  particleColor?: string;
}

const QuantumParticleSystem = ({
  particleCount = 50,
  connectionDistance = 150,
  particleColor = '#00ff66',
}: QuantumParticleSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number>();
  const [isActive, setIsActive] = useState(false);

  // Setup canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get context
    const context = canvas.getContext('2d');
    if (!context) return;
    contextRef.current = context;

    // Handle resize
    const handleResize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      
      // Set canvas size with high DPI support
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.scale(dpr, dpr);
      
      // Regenerate particles when size changes
      initParticles(width, height);
    };

    // Init particles
    const initParticles = (width: number, height: number) => {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color: particleColor,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        originalSpeed: Math.random() * 0.5 + 0.2
      }));
    };

    // Set up mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Initialize
    handleResize();
    
    // Start the animation after a delay
    setTimeout(() => setIsActive(true), 500);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [particleCount, particleColor]); 

  // Animation loop
  useEffect(() => {
    if (!isActive) return;
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    const animate = () => {
      const { width, height } = canvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      
      // Draw particles and connections
      drawParticles(context, width, height);
      
      // Continue animation
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, connectionDistance]);

  // Draw particles and connections
  const drawParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    
    // Update and draw particles
    particles.forEach((p, i) => {
      // Apply forces if mouse is active
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          // Draw connection to mouse
          const opacity = 1 - distance / connectionDistance;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${hexToRgb(particleColor)}, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          
          // Apply attraction force
          const force = 0.2;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
      }
      
      // Check connections with other particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p2.x - p.x;
        const dy = p2.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance * 0.7) {
          const opacity = 1 - distance / (connectionDistance * 0.7);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${hexToRgb(particleColor)}, ${opacity * 0.2})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
      
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Slow down particles (friction)
      p.vx *= 0.98;
      p.vy *= 0.98;
      
      // Normalize speed occasionally
      if (Math.random() < 0.01) {
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed > 0) {
          p.vx = (p.vx / currentSpeed) * p.originalSpeed;
          p.vy = (p.vy / currentSpeed) * p.originalSpeed;
        }
      }
      
      // Bounce off walls
      if (p.x < 0 || p.x > width) p.vx = -p.vx;
      if (p.y < 0 || p.y > height) p.vy = -p.vy;
      
      // Keep within bounds
      p.x = Math.max(0, Math.min(width, p.x));
      p.y = Math.max(0, Math.min(height, p.y));
      
      // Draw particle
      const glowRadius = p.radius * 3;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
      gradient.addColorStop(0, `rgba(${hexToRgb(particleColor)}, 0.8)`);
      gradient.addColorStop(1, `rgba(${hexToRgb(particleColor)}, 0)`);
      
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Core particle
      ctx.beginPath();
      ctx.fillStyle = particleColor;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  
  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 255, 102'; // Default to green
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