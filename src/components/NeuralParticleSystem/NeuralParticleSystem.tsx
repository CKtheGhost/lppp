// src/components/NeuralParticleSystem/NeuralParticleSystem.tsx
'use client';

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import styles from './NeuralParticleSystem.module.css';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';
import { useNeuralParticles } from './hooks/useNeuralParticles';
import { useMatrixEffect } from './hooks/useMatrixEffect';
import { useDataTransfer } from './hooks/useDataTransfer';
import { useThemeColors } from '@/hooks/useThemeColors';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef<boolean>(false);
  const isInitializedRef = useRef<boolean>(false);
  const lastParticleTimeRef = useRef<number>(0);
  
  // Get theme colors
  const themeColors = useThemeColors(colorScheme);
  
  // Use custom hooks for different particle systems
  const {
    canvasRef: mainCanvasRef,
    particles,
    updateParticles,
    addParticles,
    initParticles
  } = useNeuralParticles({
    density,
    connectDistance,
    pulseNodes,
    enableGlow,
    themeColors
  });
  
  const {
    canvasRef: matrixCanvasRef,
    updateMatrix,
    initMatrix,
    addMatrixFragments
  } = useMatrixEffect({
    enabled: matrixEffect,
    density: codeFragmentDensity,
    flowDirection,
    themeColors
  });
  
  const {
    canvasRef: dataCanvasRef,
    updateDataTransfer,
    initDataTransfer
  } = useDataTransfer({
    enabled: dataTransferEffect,
    enableGlow,
    themeColors
  });
  
  // Optimize canvas setup
  const setupCanvas = useCallback((canvas: HTMLCanvasElement | null, dimensions: { width: number; height: number }) => {
    if (!canvas) return null;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    
    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
      willReadFrequently: false
    });
    
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    
    return ctx;
  }, []);
  
  // Handle resize with debounce
  useEffect(() => {
    const handleResize = () => {
      isResizingRef.current = true;
      
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        
        // Setup all canvases
        setupCanvas(mainCanvasRef.current, { width: offsetWidth, height: offsetHeight });
        if (matrixEffect) setupCanvas(matrixCanvasRef.current, { width: offsetWidth, height: offsetHeight });
        if (dataTransferEffect) setupCanvas(dataCanvasRef.current, { width: offsetWidth, height: offsetHeight });
        
        // Reinitialize systems if needed
        if (isInitializedRef.current) {
          initParticles(offsetWidth, offsetHeight);
          if (matrixEffect) initMatrix(offsetWidth, offsetHeight);
          if (dataTransferEffect) initDataTransfer();
        }
      }
      
      isResizingRef.current = false;
    };
    
    handleResize();
    
    let resizeTimer: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', throttledResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(resizeTimer);
    };
  }, [setupCanvas, matrixEffect, dataTransferEffect, initParticles, initMatrix, initDataTransfer]);
  
  // Initialize on mount
  useEffect(() => {
    if (!isInitializedRef.current && containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      
      initParticles(offsetWidth, offsetHeight);
      if (matrixEffect) initMatrix(offsetWidth, offsetHeight);
      if (dataTransferEffect) initDataTransfer();
      
      isInitializedRef.current = true;
    }
  }, [initParticles, initMatrix, initDataTransfer, matrixEffect, dataTransferEffect]);
  
  // Optimize mouse interaction
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!interactive || isResizingRef.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Throttle particle creation
    const now = Date.now();
    if (now - lastParticleTimeRef.current > 50) {
      addParticles(x, y, 1);
      lastParticleTimeRef.current = now;
    }
  }, [interactive, addParticles]);
  
  const handleClick = useCallback((e: MouseEvent) => {
    if (!reactToClick || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    addParticles(x, y, 10);
    if (matrixEffect) addMatrixFragments(x, y, 10);
  }, [reactToClick, addParticles, matrixEffect, addMatrixFragments]);
  
  // Event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('click', handleClick);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
    };
  }, [handleMouseMove, handleClick]);
  
  // Main animation loop using optimized RAF hook
  useAnimationFrame((deltaTime) => {
    if (isResizingRef.current) return;
    
    updateParticles(deltaTime);
    if (matrixEffect) updateMatrix(deltaTime);
    if (dataTransferEffect) updateDataTransfer(deltaTime);
  });
  
  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${styles[colorScheme]} ${styles.active}`}
      aria-hidden="true"
    >
      <canvas ref={mainCanvasRef} className={styles.canvas} />
      {matrixEffect && (
        <canvas ref={matrixCanvasRef} className={`${styles.canvas} ${styles.matrixCanvas}`} />
      )}
      {dataTransferEffect && (
        <canvas ref={dataCanvasRef} className={`${styles.canvas} ${styles.dataCanvas}`} />
      )}
    </div>
  );
};

export default React.memo(NeuralParticleSystem);