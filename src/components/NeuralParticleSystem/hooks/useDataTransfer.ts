'use client';

import { useRef, useCallback } from 'react';

interface DataPacket {
  sourceIndex: number;
  targetIndex: number;
  x: number;
  y: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

interface UseDataTransferProps {
  enabled: boolean;
  enableGlow: boolean;
  themeColors: any;
}

export function useDataTransfer({
  enabled,
  enableGlow,
  themeColors
}: UseDataTransferProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const packetsRef = useRef<DataPacket[]>([]);
  
  const initDataTransfer = useCallback(() => {
    packetsRef.current = [];
  }, []);
  
  const createDataPacket = useCallback((
    sourceIndex: number,
    targetIndex: number,
    particles: any[]
  ) => {
    const source = particles[sourceIndex];
    const target = particles[targetIndex];
    
    if (!source || !target) return null;
    
    return {
      sourceIndex,
      targetIndex,
      x: source.x,
      y: source.y,
      progress: 0,
      speed: Math.random() * 0.02 + 0.01,
      color: themeColors.data || '#00ff00',  // Fallback to default green if data color is undefined
      size: Math.random() * 1.5 + 1
    };
  }, [themeColors]);
  
  const updateDataTransfer = useCallback((deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    const { width, height } = canvas;
    
    ctx.clearRect(0, 0, width, height);
    
    const packets = packetsRef.current;
    const updatedPackets: DataPacket[] = [];
    
    for (let i = 0; i < packets.length; i++) {
      const packet = packets[i];
      
      packet.progress += packet.speed * deltaTime * 60;
      
      if (packet.progress >= 1) {
        continue;
      }
      
      // Simplified bezier curve calculation for example
      const t = packet.progress;
      const x = packet.x + t * 100; // Simplified movement
      const y = packet.y + t * 100; // Simplified movement
      
      // Draw packet with glow
      if (enableGlow) {
        const glowGradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, packet.size * 5
        );
        
        glowGradient.addColorStop(0, packet.color.includes('rgb') 
          ? packet.color.replace(')', ', 0.5)').replace('rgb', 'rgba')
          : `${packet.color}80`);
        glowGradient.addColorStop(1, packet.color.includes('rgb')
          ? packet.color.replace(')', ', 0)').replace('rgb', 'rgba')
          : `${packet.color}00`);
        
        ctx.beginPath();
        ctx.fillStyle = glowGradient;
        ctx.arc(x, y, packet.size * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.beginPath();
      ctx.fillStyle = packet.color;
      ctx.arc(x, y, packet.size, 0, Math.PI * 2);
      ctx.fill();
      
      updatedPackets.push(packet);
    }
    
    packetsRef.current = updatedPackets;
  }, [enableGlow]);
  
  return {
    canvasRef,
    updateDataTransfer,
    initDataTransfer,
    createDataPacket,
    packets: packetsRef.current
  };
}