'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import styles from './loading.module.css';
import { PROSPERA_PERFORMANCE } from '@/utils/performanceUtils';

export interface LoadingProps {
  messages?: string[];
  logoPath?: string;
  initialDelay?: number;
  progressDuration?: number;
  theme?: 'green' | 'blue' | 'purple' | 'red' | 'cyan' | 'multi';
  matrixEffect?: boolean;
  codeFragmentDensity?: number;
  onLoaded?: () => void;
}

// Type definitions
interface CodeFragment {
  x: number;
  y: number;
  char: string;
  opacity: number;
  speed: number;
  lifespan: number;
  age: number;
  scale: number;
  rotation: number;
  hue: number;
}

interface ConnectionNode {
  x: number;
  y: number;
  size: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  active: boolean;
  pulseRate: number;
  phase: number;
  connections: number[];
}

interface DataPacket {
  sourceIndex: number;
  targetIndex: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
}

const Loading: React.FC<LoadingProps> = ({
  messages = [
    'Initializing quantum environment...',
    'Establishing neural connections...',
    'Calibrating particle harmonics...',
    'Synchronizing dimensional matrices...',
    'Activating neural interface...'
  ],
  logoPath = '/images/logo.svg',
  initialDelay = 200,
  progressDuration = 4500,
  theme = 'green',
  matrixEffect = true,
  codeFragmentDensity = 30,
  onLoaded
}) => {
  // State management
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(messages[0]);
  const [isHidden, setIsHidden] = useState(false);
  const [codeFragments, setCodeFragments] = useState<CodeFragment[]>([]);
  const [connectionNodes, setConnectionNodes] = useState<ConnectionNode[]>([]);
  const [dataPackets, setDataPackets] = useState<DataPacket[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hasStarted, setHasStarted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Configuration state
  const [loadingSteps, setLoadingSteps] = useState<{
    step: number;
    totalSteps: number;
    stepNames: string[];
  }>({
    step: 0,
    totalSteps: 5,
    stepNames: messages,
  });
  
  // Refs
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  const connectionsCanvasRef = useRef<HTMLCanvasElement>(null);
  const dataCanvasRef = useRef<HTMLCanvasElement>(null);
  const matrixAnimationRef = useRef<number | null>(null);
  const connectionsAnimationRef = useRef<number | null>(null);
  const dataAnimationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const hasInitializedRef = useRef(false);
  
  // Matrix characters with specialized sets
  const matrixChars = useMemo(() => {
    const standard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=<>[]{}|~^%#@!?;:,.".split('');
    const quantum = "ΨΦΩαβγδεζηθικλμνξπρστυφχψω∞∫∂∇∑∏√∛∜∝∞∟∠∡∢∴∵∶∷∸∹∺∻∼∽∾∿≀≁≂≃≄≅≆≇≈≉≊≋≌≍≎≏≐≑≒≓≔≕≖≗≘≙≚≛≜≝≞≟≠≡≢≣≤≥≦≧≨≩≪≫≬≭≮≯≰≱≲≳≴≵≶≷≸≹≺≻≼≽≾≿⊀⊁⊂⊃⊄⊅⊆⊇⊈⊉⊊⊋⊌⊍⊎⊏⊐⊑⊒⊓⊔⊕⊖⊗⊘⊙⊚⊛⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯⊰⊱⊲⊳⊴⊵⊶⊷⊸⊹⊺⊻⊼⊽⊾⊿⋀⋁⋂⋃⋄⋅⋆⋇⋈⋉⋊⋋⋌⋍⋎⋏⋐⋑⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⋠⋡⋢⋣⋤⋥⋦⋧⋨⋩⋪⋫⋬⋭⋮⋯⋰⋱⋲⋳⋴⋵⋶⋷⋸⋹⋺⋻⋼⋽⋾⋿".split('');
    
    // Create a combined set with quantum characters more rare
    return [...standard, ...quantum.filter((_, i) => i % 3 === 0)];
  }, []);

  // Theme colors with enhanced composition
  const themeColors = useMemo(() => {
    const baseColors = {
      green: {
        primary: '#00ff00',
        secondary: '#00cc44',
        tertiary: '#00bb66',
        text: '#ccffcc',
        shadow: 'rgba(0, 255, 0, 0.5)',
        data: {
          primary: '#ccffcc',
          secondary: '#00ff99',
          tertiary: '#66ffcc',
        }
      },
      blue: {
        primary: '#0088ff',
        secondary: '#00ccff',
        tertiary: '#50aaff',
        text: '#ccf5ff',
        shadow: 'rgba(0, 136, 255, 0.5)',
        data: {
          primary: '#ccf5ff',
          secondary: '#66ccff',
          tertiary: '#99ddff',
        }
      },
      purple: {
        primary: '#aa00ff',
        secondary: '#cc66ff',
        tertiary: '#9933cc',
        text: '#eeccff',
        shadow: 'rgba(170, 0, 255, 0.5)',
        data: {
          primary: '#eeccff',
          secondary: '#dd99ff',
          tertiary: '#cc77ff',
        }
      },
      red: {
        primary: '#ff3311',
        secondary: '#ff6644',
        tertiary: '#ff4422',
        text: '#ffcccc',
        shadow: 'rgba(255, 51, 17, 0.5)',
        data: {
          primary: '#ffcccc',
          secondary: '#ff7777',
          tertiary: '#ff9999',
        }
      },
      cyan: {
        primary: '#00ffff',
        secondary: '#66ffff',
        tertiary: '#33cccc',
        text: '#ccffff',
        shadow: 'rgba(0, 255, 255, 0.5)',
        data: {
          primary: '#ccffff',
          secondary: '#99ffff',
          tertiary: '#77dddd',
        }
      },
      multi: {
        primary: '#00ff00',
        secondary: '#00ccff',
        tertiary: '#aa00ff',
        text: '#ffffff',
        shadow: 'rgba(0, 255, 102, 0.5)',
        data: {
          primary: '#ffffff',
          secondary: '#ccffcc',
          tertiary: '#ccf5ff',
        }
      }
    };
    
    // Add gradients
    return Object.entries(baseColors).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: {
          ...value,
          gradients: {
            primary: `linear-gradient(90deg, ${value.primary} 0%, ${value.secondary} 100%)`,
            radial: `radial-gradient(circle, ${value.primary}80 0%, ${value.secondary}40 50%, transparent 80%)`,
            progressBar: `linear-gradient(90deg, ${value.primary}cc, ${value.secondary}ff, ${value.tertiary}ee, ${value.primary}cc)`,
          }
        }
      };
    }, {}) as typeof baseColors;
  }, []);
  
  // Initialize dimensions and listeners
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({
        width: offsetWidth,
        height: offsetHeight
      });
    };
    
    // Initialize performance tracking
    PROSPERA_PERFORMANCE.mark('loadingComponentInit');
    
    // Update on resize
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Set loading steps
    setLoadingSteps({
      step: 0,
      totalSteps: messages.length,
      stepNames: messages,
    });
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [messages]);
  
  // Initialize animations when dimensions are ready
  useEffect(() => {
    if (dimensions.width <= 0 || dimensions.height <= 0 || hasInitializedRef.current) return;
    
    // Set canvases with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    
    if (matrixCanvasRef.current) {
      matrixCanvasRef.current.width = dimensions.width * dpr;
      matrixCanvasRef.current.height = dimensions.height * dpr;
      
      const ctx = matrixCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }
    
    if (connectionsCanvasRef.current) {
      connectionsCanvasRef.current.width = dimensions.width * dpr;
      connectionsCanvasRef.current.height = dimensions.height * dpr;
      
      const ctx = connectionsCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }
    
    if (dataCanvasRef.current) {
      dataCanvasRef.current.width = dimensions.width * dpr;
      dataCanvasRef.current.height = dimensions.height * dpr;
      
      const ctx = dataCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }
    
    // Initialize matrices
    if (matrixEffect) {
      initCodeFragments();
      initConnectionNodes();
    }
    
    hasInitializedRef.current = true;
    setIsInitialized(true);
    PROSPERA_PERFORMANCE.mark('loadingAnimationsInitialized');
  }, [dimensions, matrixEffect, codeFragmentDensity]);
  
  // Get color based on theme
  const getColor = useCallback((
    type: 'primary' | 'secondary' | 'tertiary' | 'text' | 'shadow' | 'gradients.primary' | 'gradients.radial' | 'gradients.progressBar' | 'data.primary' | 'data.secondary' | 'data.tertiary'
  ) => {
    const pathParts = type.split('.');
    let result: any = themeColors[theme];
    
    // Navigate through nested properties
    for (const part of pathParts) {
      if (result && result[part]) {
        result = result[part];
      } else {
        return '';
      }
    }
    
    return result;
  }, [theme, themeColors]);

  // Initialize code fragments with advanced properties
  const initCodeFragments = useCallback(() => {
    const fragments: CodeFragment[] = [];
    // Scale fragments based on screen size and density
    const count = Math.floor(dimensions.width * dimensions.height / 20000 * codeFragmentDensity);
    
    for (let i = 0; i < count; i++) {
      fragments.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height - dimensions.height, // Start above viewport
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 2 + 1,
        lifespan: Math.random() * 200 + 100,
        age: 0,
        scale: Math.random() * 0.5 + 0.8,
        rotation: (Math.random() - 0.5) * 0.5,
        hue: Math.random() * 30 // For multi theme
      });
    }
    
    setCodeFragments(fragments);
  }, [dimensions, codeFragmentDensity, matrixChars]);
  
  // Initialize connection nodes with network topology
  const initConnectionNodes = useCallback(() => {
    const nodes: ConnectionNode[] = [];
    const nodeCount = Math.min(Math.floor(dimensions.width * dimensions.height / 50000), 12);
    
    // Create quantum nodes
    for (let i = 0; i < nodeCount; i++) {
      const isCore = i === 0;
      
      nodes.push({
        x: isCore ? dimensions.width / 2 : Math.random() * dimensions.width,
        y: isCore ? dimensions.height / 2 : Math.random() * dimensions.height,
        size: isCore ? 10 : Math.random() * 4 + 2,
        targetX: dimensions.width / 2,
        targetY: dimensions.height / 2,
        progress: 0,
        speed: Math.random() * 0.003 + 0.001,
        active: isCore,
        pulseRate: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        connections: []
      });
    }
    
    // Establish network connections
    nodes.forEach((node, i) => {
      if (i === 0) return; // Skip core node
      
      // Core node always connects to all
      nodes[0].connections.push(i);
      
      // Add some peer connections for non-core nodes
      const connectionCount = Math.floor(Math.random() * 2) + 1;
      
      for (let j = 0; j < connectionCount; j++) {
        let targetIdx;
        do {
          targetIdx = Math.floor(Math.random() * nodes.length);
        } while (targetIdx === i || node.connections.includes(targetIdx));
        
        if (targetIdx !== undefined) {
          node.connections.push(targetIdx);
        }
      }
    });
    
    setConnectionNodes(nodes);
  }, [dimensions]);
  
  // Create data packet for neural synapse transmission
  const createDataPacket = useCallback((sourceIdx: number, targetIdx: number): DataPacket => {
    return {
      sourceIndex: sourceIdx,
      targetIndex: targetIdx,
      progress: 0,
      speed: Math.random() * 0.01 + 0.005,
      size: Math.random() * 2 + 1,
      color: theme === 'multi' 
        ? `hsl(${Math.random() * 120 + 90}, 100%, 80%)`
        : getColor('data.primary')
    };
  }, [theme, getColor]);
  
  // Animate matrix code rain
  useEffect(() => {
    if (!isInitialized || !matrixEffect || !matrixCanvasRef.current || codeFragments.length === 0) return;
    
    const canvas = matrixCanvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    const animate = () => {
      // Apply semi-transparent clear for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Update fragments
      setCodeFragments(prev => {
        return prev.map(fragment => {
          // Age fragment
          const updatedAge = fragment.age + 1;
          
          // Check if expired
          if (updatedAge > fragment.lifespan) {
            // Recycle the fragment
            return {
              ...fragment,
              x: Math.random() * dimensions.width,
              y: -20,
              char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
              opacity: Math.random() * 0.5 + 0.3,
              speed: Math.random() * 2 + 1,
              lifespan: Math.random() * 200 + 100,
              age: 0,
              scale: Math.random() * 0.5 + 0.8,
              rotation: (Math.random() - 0.5) * 0.5,
              hue: Math.random() * 30
            };
          }
          
          // Move fragment
          const updatedY = fragment.y + fragment.speed;
          
          // Calculate opacity based on lifecycle
          const lifecycleOpacity = updatedAge < fragment.lifespan * 0.1
            ? updatedAge / (fragment.lifespan * 0.1) * fragment.opacity
            : updatedAge > fragment.lifespan * 0.8
              ? (1 - (updatedAge - fragment.lifespan * 0.8) / (fragment.lifespan * 0.2)) * fragment.opacity
              : fragment.opacity;
          
          // Draw character
          ctx.save();
          ctx.translate(fragment.x, updatedY);
          ctx.rotate(fragment.rotation);
          ctx.scale(fragment.scale, fragment.scale);
          
          // Set text rendering
          ctx.font = '16px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Apply color based on theme
          if (theme === 'multi') {
            ctx.fillStyle = `hsla(${fragment.hue + progress * 0.5}, 100%, 70%, ${lifecycleOpacity})`;
          } else {
            ctx.fillStyle = `${getColor('primary')}${Math.floor(lifecycleOpacity * 255).toString(16).padStart(2, '0')}`;
          }
          
          // Draw the character
          ctx.fillText(fragment.char, 0, 0);
          ctx.restore();
          
          // Randomly change character
          const newChar = Math.random() < 0.03
            ? matrixChars[Math.floor(Math.random() * matrixChars.length)]
            : fragment.char;
          
          return {
            ...fragment,
            y: updatedY,
            age: updatedAge,
            char: newChar
          };
        });
      });
      
      matrixAnimationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (matrixAnimationRef.current) {
        cancelAnimationFrame(matrixAnimationRef.current);
      }
    };
  }, [isInitialized, matrixEffect, dimensions, codeFragments, progress, theme, getColor, matrixChars]);
  
  // Animate network connections
  useEffect(() => {
    if (!isInitialized || !matrixEffect || !connectionsCanvasRef.current || connectionNodes.length === 0) return;
    
    const canvas = connectionsCanvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Update node activation based on progress
      const activeNodesCount = Math.floor((connectionNodes.length - 1) * (progress / 100)) + 1;
      
      // Update nodes
      setConnectionNodes(prev => {
        const updatedNodes = [...prev];
        
        // Activate nodes progressively
        for (let i = 0; i < updatedNodes.length; i++) {
          // Core node is always active
          if (i === 0) continue;
          
          updatedNodes[i].active = i < activeNodesCount;
          
          // Pulse effect
          if (updatedNodes[i].active) {
            updatedNodes[i].phase += updatedNodes[i].pulseRate;
            
            // Create data packet occasionally
            if (Math.random() < 0.01 && progress > 30) {
              // From this node to core
              if (Math.random() < 0.7) {
                setDataPackets(packets => [...packets, createDataPacket(i, 0)]);
              }
              // From core to this node
              else {
                setDataPackets(packets => [...packets, createDataPacket(0, i)]);
              }
            }
            
            // Sometimes send to peers
            if (updatedNodes[i].connections.length > 0 && Math.random() < 0.002 && progress > 60) {
              const targetIdx = updatedNodes[i].connections[
                Math.floor(Math.random() * updatedNodes[i].connections.length)
              ];
              
              setDataPackets(packets => [...packets, createDataPacket(i, targetIdx)]);
            }
          }
        }
        
        return updatedNodes;
      });
      
      // Draw connections
      connectionNodes.forEach((sourceNode, sourceIndex) => {
        sourceNode.connections.forEach(targetIndex => {
          const targetNode = connectionNodes[targetIndex];
          
          // Skip inactive connections
          if (!sourceNode.active || !targetNode.active) return;
          
          // Calculate distance and opacity
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const baseOpacity = 0.2 + 0.1 * Math.sin(timestamp * 0.001 + sourceNode.phase);
          
          // Create gradient for line
          const gradient = ctx.createLinearGradient(
            sourceNode.x, sourceNode.y,
            targetNode.x, targetNode.y
          );
          
          gradient.addColorStop(0, `${getColor('primary')}${Math.floor(baseOpacity * 255).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(1, `${getColor('secondary')}${Math.floor(baseOpacity * 255).toString(16).padStart(2, '0')}`);
          
          // Draw connection line
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();
        });
      });
      
      // Draw nodes
      connectionNodes.forEach((node, index) => {
        if (!node.active) return;
        
        // Node pulse effect
        const pulseScale = 1 + 0.2 * Math.sin(timestamp * 0.002 + node.phase);
        const glowOpacity = 0.3 + 0.2 * Math.sin(timestamp * 0.002 + node.phase);
        
        // Draw node glow
        ctx.beginPath();
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size * 5 * pulseScale
        );
        
        glowGradient.addColorStop(0, `${getColor('primary')}${Math.floor(glowOpacity * 255).toString(16).padStart(2, '0')}`);
        glowGradient.addColorStop(1, `${getColor('primary')}00`);
        
        ctx.fillStyle = glowGradient;
        ctx.arc(node.x, node.y, node.size * 5 * pulseScale, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw node core
        ctx.beginPath();
        
        // Special core highlight for first node
        if (index === 0) {
          ctx.fillStyle = getColor('primary');
        } else {
          ctx.fillStyle = getColor('secondary');
        }
        
        ctx.arc(node.x, node.y, node.size * pulseScale, 0, Math.PI * 2);
        ctx.fill();
      });
      
      connectionsAnimationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      if (connectionsAnimationRef.current) {
        cancelAnimationFrame(connectionsAnimationRef.current);
      }
    };
  }, [isInitialized, matrixEffect, dimensions, connectionNodes, progress, getColor, createDataPacket]);
  
  // Animate data packets
  useEffect(() => {
    if (!isInitialized || !matrixEffect || !dataCanvasRef.current) return;
    
    const canvas = dataCanvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Update and draw data packets
      setDataPackets(prev => {
        return prev.filter(packet => {
          // Skip if nodes don't exist
          if (!connectionNodes[packet.sourceIndex] || !connectionNodes[packet.targetIndex]) {
            return false;
          }
          
          // Get nodes
          const sourceNode = connectionNodes[packet.sourceIndex];
          const targetNode = connectionNodes[packet.targetIndex];
          
          // Update progress
          const updatedProgress = packet.progress + packet.speed;
          
          // Remove if complete
          if (updatedProgress >= 1) {
            return false;
          }
          
          // Calculate position using bezier curve for arc effect
          const t = updatedProgress;
          const x1 = sourceNode.x;
          const y1 = sourceNode.y;
          const x2 = targetNode.x;
          const y2 = targetNode.y;
          
          // Control point offset
          const cpOffsetX = (x2 - x1) * 0.5 - (y2 - y1) * 0.5;
          const cpOffsetY = (y2 - y1) * 0.5 + (x2 - x1) * 0.5;
          
          // Control point
          const cpX = (x1 + x2) / 2 + cpOffsetX * 0.3;
          const cpY = (y1 + y2) / 2 + cpOffsetY * 0.3;
          
          // Quadratic bezier formula
          const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cpX + t * t * x2;
          const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cpY + t * t * y2;
          
          // Draw glow
          ctx.beginPath();
          const glowGradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, packet.size * 5
          );
          
          glowGradient.addColorStop(0, `${packet.color}80`);
          glowGradient.addColorStop(1, `${packet.color}00`);
          
          ctx.fillStyle = glowGradient;
          ctx.arc(x, y, packet.size * 5, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw packet core
          ctx.beginPath();
          ctx.fillStyle = packet.color;
          ctx.arc(x, y, packet.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add motion blur trail
          const trailLength = 3;
          for (let i = 1; i <= trailLength; i++) {
            const trailT = Math.max(0, t - i * 0.03);
            const trailX = (1 - trailT) * (1 - trailT) * x1 + 2 * (1 - trailT) * trailT * cpX + trailT * trailT * x2;
            const trailY = (1 - trailT) * (1 - trailT) * y1 + 2 * (1 - trailT) * trailT * cpY + trailT * trailT * y2;
            
            ctx.beginPath();
            ctx.fillStyle = `${packet.color}${Math.floor((0.7 - i * 0.2) * 255).toString(16).padStart(2, '0')}`;
            ctx.arc(trailX, trailY, packet.size * (1 - i * 0.2), 0, Math.PI * 2);
            ctx.fill();
          }
          
          return {
            ...packet,
            progress: updatedProgress
          };
        });
      });
      
      dataAnimationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (dataAnimationRef.current) {
        cancelAnimationFrame(dataAnimationRef.current);
      }
    };
  }, [isInitialized, matrixEffect, dimensions, connectionNodes, dataPackets]);
  
  // Handle progress simulation - FIXED to prevent infinite loop
  useEffect(() => {
    if (hasStarted) return;
    
    PROSPERA_PERFORMANCE.mark('loadingProgressStart');
    
    // Add loading class to body
    if (typeof document !== 'undefined') {
      document.body.classList.add('loading');
    }
    
    // Wait for initial delay
    const delayTimer = setTimeout(() => {
      startTimeRef.current = Date.now();
      setHasStarted(true);
      
      const progressInterval = setInterval(() => {
        if (!startTimeRef.current) return;
        
        const elapsed = Date.now() - startTimeRef.current;
        const progressPercentage = Math.min(100, (elapsed / progressDuration) * 100);
        
        setProgress(progressPercentage);
        
        // Update status message based on progress
        const messageIndex = Math.min(
          Math.floor(progressPercentage / (100 / loadingSteps.totalSteps)),
          loadingSteps.totalSteps - 1
        );
        
        setStatusMessage(loadingSteps.stepNames[messageIndex]);
        setLoadingSteps(prev => ({
          ...prev,
          step: messageIndex
        }));
        
        // Handle completion
        if (progressPercentage >= 100) {
          completedRef.current = true;
          clearInterval(progressInterval);
          
          PROSPERA_PERFORMANCE.mark('loadingProgressComplete');
          
          // Complete loading with delay
          setTimeout(() => {
            setIsHidden(true);
            
            // Remove loading class and dispatch event
            setTimeout(() => {
              if (typeof document !== 'undefined') {
                document.body.classList.remove('loading');
              }
              
              // Dispatch event for other components
              window.dispatchEvent(new Event('matrixLoaded'));
              
              // Call onLoaded callback if provided
              if (onLoaded) {
                onLoaded();
              }
              
              PROSPERA_PERFORMANCE.mark('loadingComplete');
            }, 600);
          }, 800);
        }
      }, 50);
      
      return () => {
        clearInterval(progressInterval);
      };
    }, initialDelay);
    
    return () => {
      clearTimeout(delayTimer);
      
      // Ensure loading class is removed
      if (typeof document !== 'undefined') {
        document.body.classList.remove('loading');
      }
    };
  }, [hasStarted, initialDelay, loadingSteps, onLoaded, progressDuration]); // Proper dependency array
  
  // Type animation for status messages
  const [displayedText, setDisplayedText] = useState('');
  const typingRef = useRef<{ active: boolean; messageIndex: number }>({
    active: false, 
    messageIndex: -1
  });
  
  // Handle typing animation when status message changes
  useEffect(() => {
    const currentIndex = loadingSteps.stepNames.indexOf(statusMessage);
    
    // Skip if already typed this message
    if (typingRef.current.messageIndex === currentIndex) return;
    
    typingRef.current = { active: true, messageIndex: currentIndex };
    
    let charIndex = 0;
    setDisplayedText('');
    
    // Type the message character by character
    const typeNextChar = () => {
      if (!typingRef.current.active) return;
      
      if (charIndex < statusMessage.length) {
        setDisplayedText(statusMessage.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typeNextChar, Math.random() * 30 + 20);
      } else {
        typingRef.current.active = false;
      }
    };
    
    typeNextChar();
    
    return () => {
      typingRef.current.active = false;
    };
  }, [statusMessage, loadingSteps.stepNames]);
  
  // Generate a hexadecimal opacity value
  const hexOpacity = (value: number): string => {
    return Math.floor(Math.max(0, Math.min(1, value)) * 255).toString(16).padStart(2, '0');
  };

  return (
    <div 
      ref={containerRef}
      className={`${styles.loadingOverlay} ${isHidden ? styles.hidden : ''} ${styles[theme]}`}
      aria-live="polite"
      aria-busy={!isHidden}
    >
      {/* Matrix effect canvases */}
      {matrixEffect && (
        <>
          <canvas 
            ref={matrixCanvasRef}
            className={styles.matrixCanvas}
            aria-hidden="true"
          />
          <canvas 
            ref={connectionsCanvasRef}
            className={styles.connectionsCanvas}
            aria-hidden="true"
          />
          <canvas 
            ref={dataCanvasRef}
            className={styles.dataCanvas}
            aria-hidden="true"
          />
        </>
      )}
      
      <div className={styles.loadingContent}>
        <div className={styles.logoPulse}>
          <div 
            className={styles.logoIcon}
            style={{ 
              backgroundColor: getColor('primary'),
              maskImage: `url('${logoPath}')`,
              WebkitMaskImage: `url('${logoPath}')`
            }}
          ></div>
          <div className={styles.pulseRings}>
            <div className={styles.pulseRing} style={{ borderColor: getColor('primary') }}></div>
            <div className={styles.pulseRing} style={{ borderColor: getColor('primary') }}></div>
            <div className={styles.pulseRing} style={{ borderColor: getColor('primary') }}></div>
          </div>
        </div>
        
        <div 
          className={styles.loadingText}
          style={{ color: getColor('text') }}
        >
          {displayedText}
          <span 
            className={styles.cursor}
            style={{ backgroundColor: getColor('primary') }}
          ></span>
        </div>
        
        <div className={styles.loadingProgress}>
          <div 
            className={styles.loadingBar} 
            style={{ 
              width: `${progress}%`, 
              background: getColor('gradients.progressBar'),
              backgroundSize: '200% 100%'
            }}
          >
            <div className={styles.glowEffect}></div>
          </div>
          
          <div className={styles.progressNumbers}>
            <span 
              className={styles.progressPercent}
              style={{ color: getColor('primary') }}
            >
              {Math.floor(progress)}%
            </span>
          </div>
        </div>
        
        <div className={styles.loadingStatus}>
          <span 
            className={styles.statusDot}
            style={{ backgroundColor: getColor('primary') }}
          ></span>
          <span 
            className={styles.statusMessage}
            style={{ color: getColor('text') }}
          >
            Initializing quantum protocols
          </span>
        </div>
        
        {/* Step indicators */}
        <div className={styles.loadingSteps}>
          {loadingSteps.stepNames.map((_, i) => (
            <div 
              key={i}
              className={`${styles.loadingStep} ${i <= loadingSteps.step ? styles.completed : ''}`}
              style={{
                backgroundColor: i <= loadingSteps.step 
                  ? getColor('primary') 
                  : `${getColor('primary')}${hexOpacity(0.3)}`,
                boxShadow: i <= loadingSteps.step 
                  ? `0 0 10px ${getColor('shadow')}` 
                  : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;