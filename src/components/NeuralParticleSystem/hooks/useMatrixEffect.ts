'use client';

import { useRef, useCallback } from 'react';

interface CodeFragment {
  x: number;
  y: number;
  speed: number;
  char: string;
  opacity: number;
  lifespan: number;
  age: number;
}

interface UseMatrixEffectProps {
  enabled: boolean;
  density: number;
  flowDirection: 'down' | 'up' | 'random';
  themeColors: any;
}

export function useMatrixEffect({
  enabled,
  density,
  flowDirection,
  themeColors
}: UseMatrixEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fragmentsRef = useRef<CodeFragment[]>([]);
  
  const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=<>[]{}|~^%#@!?;:,.ΨΦΩαβγδεζηθικλμνξπρστυφχψω∞∫∂∇∑∏√∛∜∝∞".split('');
  
  const createFragment = useCallback((width: number, yOffset = 0) => {
    return {
      x: Math.random() * width,
      y: flowDirection === 'up' 
        ? width + yOffset
        : -Math.random() * 50 - yOffset,
      speed: Math.random() * 2 + 1,
      char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
      opacity: Math.random() * 0.5 + 0.3,
      lifespan: Math.random() * 200 + 100,
      age: 0
    };
  }, [flowDirection, matrixChars]);
  
  const initMatrix = useCallback((width: number, height: number) => {
    const count = Math.min(Math.floor(density * width / 1920), 120);
    const fragments: CodeFragment[] = [];
    
    for (let i = 0; i < count; i++) {
      fragments.push(createFragment(width));
    }
    
    fragmentsRef.current = fragments;
  }, [density, createFragment]);
  
  const updateMatrix = useCallback((deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    const { width, height } = canvas;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);
    
    const fragments = fragmentsRef.current;
    const updatedFragments: CodeFragment[] = [];
    
    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];
      
      fragment.age += deltaTime * 60;
      
      if (fragment.age > fragment.lifespan) {
        continue;
      }
      
      let updatedY = fragment.y;
      if (flowDirection === 'up') {
        updatedY -= fragment.speed * deltaTime * 60;
      } else if (flowDirection === 'down') {
        updatedY += fragment.speed * deltaTime * 60;
      } else {
        updatedY += (Math.random() > 0.5 ? 1 : -1) * fragment.speed * deltaTime * 60;
      }
      
      if (updatedY < -20 || updatedY > height + 20) {
        continue;
      }
      
      const lifecycleRatio = fragment.age / fragment.lifespan;
      let opacity = fragment.opacity;
      
      if (lifecycleRatio < 0.2) {
        opacity *= lifecycleRatio * 5;
      } else if (lifecycleRatio > 0.8) {
        opacity *= (1 - (lifecycleRatio - 0.8) * 5);
      }
      
      ctx.font = '14px "JetBrains Mono", monospace';
      ctx.fillStyle = `${themeColors.primary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.fillText(fragment.char, fragment.x, updatedY);
      
      const newChar = Math.random() < 0.05
        ? matrixChars[Math.floor(Math.random() * matrixChars.length)]
        : fragment.char;
      
      updatedFragments.push({
        ...fragment,
        y: updatedY,
        char: newChar
      });
    }
    
    const targetCount = Math.min(Math.floor(density * width / 1920), 100);
    
    while (updatedFragments.length < targetCount) {
      updatedFragments.push(createFragment(width));
    }
    
    fragmentsRef.current = updatedFragments;
  }, [flowDirection, density, themeColors, matrixChars, createFragment]);
  
  const addMatrixFragments = useCallback((x: number, y: number, count: number) => {
    for (let i = 0; i < count; i++) {
      fragmentsRef.current.push({
        x: x + (Math.random() - 0.5) * 100,
        y,
        speed: Math.random() * 3 + 2,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        opacity: Math.random() * 0.7 + 0.5,
        lifespan: Math.random() * 150 + 50,
        age: 0
      });
    }
  }, [matrixChars]);
  
  return {
    canvasRef,
    updateMatrix,
    initMatrix,
    addMatrixFragments
  };
}