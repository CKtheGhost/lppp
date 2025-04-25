'use client';

import { useRef, useCallback } from 'react';

interface NeuralParticle {
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

interface UseNeuralParticlesProps {
  density: number;
  connectDistance: number;
  pulseNodes: boolean;
  enableGlow: boolean;
  themeColors: any;
}

export function useNeuralParticles({
  density,
  connectDistance,
  pulseNodes,
  enableGlow,
  themeColors
}: UseNeuralParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<NeuralParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const frameCountRef = useRef(0);
  
  const initParticles = useCallback((width: number, height: number) => {
    const scaleFactor = (width * height) / (1920 * 1080);
    const scaledDensity = Math.max(Math.floor(density * scaleFactor), 20);
    const count = Math.min(scaledDensity, 500);
    
    const particles: NeuralParticle[] = [];
    
    for (let i = 0; i < count; i++) {
      const isNeuron = Math.random() < 0.15;
      
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isNeuron ? 0.2 : 0.5),
        vy: (Math.random() - 0.5) * (isNeuron ? 0.2 : 0.5),
        radius: isNeuron ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.5,
        color: isNeuron ? themeColors.primary : themeColors.secondary,
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
  }, [density, themeColors]);
  
  const updateParticles = useCallback((deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    
    ctx.clearRect(0, 0, width, height);
    
    const particles = particlesRef.current;
    const len = particles.length;
    
    // Update connections every 3 frames for performance
    if (frameCountRef.current % 3 === 0) {
      for (let i = 0; i < len; i++) {
        particles[i].connections = [];
        
        for (let j = i + 1; j < len; j++) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const distSquared = dx * dx + dy * dy;
          
          const maxDistSquared = (particles[i].isNeuron || particles[j].isNeuron) 
            ? connectDistance * connectDistance * 2.25 
            : connectDistance * connectDistance;
          
          if (distSquared < maxDistSquared) {
            particles[i].connections.push(j);
          }
        }
      }
    }
    
    // Update and draw particles
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      
      // Update position
      p.x += p.vx * deltaTime * 60;
      p.y += p.vy * deltaTime * 60;
      
      // Boundary checks
      if (p.x - p.radius <= 0 || p.x + p.radius >= width) {
        p.vx = -p.vx;
        p.x = Math.max(p.radius, Math.min(width - p.radius, p.x));
      }
      if (p.y - p.radius <= 0 || p.y + p.radius >= height) {
        p.vy = -p.vy;
        p.y = Math.max(p.radius, Math.min(height - p.radius, p.y));
      }
      
      // Draw connections
      for (const j of p.connections) {
        const p2 = particles[j];
        const dx = p2.x - p.x;
        const dy = p2.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxDistance = (p.isNeuron || p2.isNeuron) 
          ? connectDistance * 1.5 
          : connectDistance;
        
        let lineOpacity = 0.2 * (1 - distance / maxDistance);
        
        if (p.isNeuron && p2.isNeuron) {
          lineOpacity *= 1.5;
        }
        
        const gradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
        gradient.addColorStop(0, `${p.color.replace(')', `, ${lineOpacity})`)}`);
        gradient.addColorStop(1, `${p2.color.replace(')', `, ${lineOpacity})`)}`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = p.isNeuron && p2.isNeuron ? 0.5 : 0.3;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      
      // Draw particle
      let displayRadius = p.radius;
      let currentOpacity = p.opacity;
      
      if (p.isNeuron && pulseNodes) {
        const pulse = Math.sin(Date.now() * p.pulseRate + p.pulsePhase);
        displayRadius = p.radius * (1 + 0.2 * pulse);
        currentOpacity = p.opacity * (0.8 + 0.2 * pulse);
      }
      
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
      
      ctx.beginPath();
      ctx.fillStyle = p.color.replace(')', `, ${currentOpacity})`);
      ctx.arc(p.x, p.y, displayRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    frameCountRef.current++;
  }, [connectDistance, pulseNodes, enableGlow]);
  
  const addParticles = useCallback((x: number, y: number, count: number) => {
    const particles = particlesRef.current;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      const isNeuron = Math.random() < 0.3;
      
      if (particles.length < 500) {
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed * 0.5,
          vy: Math.sin(angle) * speed * 0.5,
          radius: isNeuron ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.5,
          color: isNeuron ? themeColors.primary : themeColors.secondary,
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
  }, [themeColors]);
  
  return {
    canvasRef,
    particles: particlesRef.current,
    updateParticles,
    addParticles,
    initParticles,
    mouseRef
  };
}