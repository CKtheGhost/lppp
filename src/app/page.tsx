'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PROSPERA_PERFORMANCE } from '@/utils/performanceUtils';
import { trackEvent } from '@/utils/analyticsUtils';
import Loading from './loading';

// Dynamically import components with no SSR to avoid hydration issues
const NeuralParticleSystem = dynamic(
  () => import('@/components/NeuralParticleSystem'),
  { ssr: false }
);

const InteractiveStellarMap = dynamic(
  () => import('@/components/InteractiveStellarMap'),
  { ssr: false }
);

const QuantumSidebar = dynamic(
  () => import('@/components/QuantumSidebar'),
  { ssr: false }
);

const DiscoveryHotspot = dynamic(
  () => import('@/components/DiscoveryHotspot'),
  { ssr: false }
);

const SignupModal = dynamic(
  () => import('@/components/SignupModal'),
  { ssr: false }
);

const HamburgerMenu = dynamic(
  () => import('@/components/HamburgerMenu'),
  { ssr: false }
);

const WormholeTransition = dynamic(
  () => import('@/components/WormholeTransition/WormholeTransition'),
  { ssr: false }
);

const SectionContainer = dynamic(
  () => import('@/components/SectionContainer'),
  { ssr: false }
);

/**
 * PROSPERA Landing Page
 * 
 * A futuristic web application featuring neural interfaces, quantum computing, 
 * and interactive discovery elements.
 */
export default function Home() {
  // Performance tracking
  useEffect(() => {
    PROSPERA_PERFORMANCE.mark('pageComponentMounted');
  }, []);

  // Loading state management
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);

  // App state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remainingSpots, setRemainingSpots] = useState(273);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  // UI state
  const [matrixQuotes] = useState<string[]>([
    "The Matrix is everywhere",
    "Follow the white rabbit",
    "There is no spoon",
    "Welcome to the desert of the real",
    "Free your mind"
  ]);
  const [currentQuote, setCurrentQuote] = useState(0);
  
  // Wormhole transition state
  const [wormholeActive, setWormholeActive] = useState(false);
  const [wormholeDestination, setWormholeDestination] = useState('');
  
  // Terminal effect text
  const [terminalText, setTerminalText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const terminalLines = useMemo(() => [
    'System online. Neural interface active.',
    'Connecting to quantum network...',
    'Dimensional matrices synchronized.',
    'Awaiting neural calibration sequence.',
    'Ready for consciousness integration.'
  ], []);
  
  // Discovery state for hidden sections
  const [discoveredSections, setDiscoveredSections] = useState({
    features: false,
    howItWorks: false,
    faq: false
  });
  
  // Active section tracking for navigation
  const [activeSection, setActiveSection] = useState('hero');
  
  // Interactive discovery points - positioned for better visibility
  const interactionPoints = useMemo(() => [
    { x: 30, y: 35, theme: 'green' },  // Features section hotspot
    { x: 70, y: 55, theme: 'blue' },   // How It Works section hotspot
    { x: 50, y: 75, theme: 'purple' }  // FAQ section hotspot
  ], []);

  // Refs
  const sectionRefs = useRef<{[key: string]: HTMLElement | null}>({
    hero: null,
    features: null,
    howItWorks: null,
    faq: null
  });
  
  const terminalRef = useRef<HTMLDivElement>(null);

  // Listen for the matrixLoaded event from the Loading component
  useEffect(() => {
    const handleLoadingComplete = () => {
      PROSPERA_PERFORMANCE.mark('loadingComplete');
      setIsAppLoading(false);
      
      // After app loading is complete, set component loaded state with a small delay
      setTimeout(() => {
        setIsLoaded(true);
        startTypingEffect();
        setFirstLoadComplete(true);
        
        // Track page load analytics
        trackEvent('page_loaded', { 
          loadTime: performance.now(),
          screenWidth: window.innerWidth, 
          screenHeight: window.innerHeight
        });
      }, 500);
    };

    // Listen for custom event from loading component
    window.addEventListener('matrixLoaded', handleLoadingComplete);

    // Check if body has loading class - if not, we can assume loading is already complete
    if (typeof document !== 'undefined' && !document.body.classList.contains('loading')) {
      handleLoadingComplete();
    } else {
      // Fallback timer in case the event is never fired
      const fallbackTimer = setTimeout(() => {
        if (!firstLoadComplete) {
          handleLoadingComplete();
          // Remove loading class if it's still there
          if (typeof document !== 'undefined') {
            document.body.classList.remove('loading');
          }
        }
      }, 8000); // 8 seconds maximum loading time
      
      return () => clearTimeout(fallbackTimer);
    }
    
    return () => window.removeEventListener('matrixLoaded', handleLoadingComplete);
  }, [firstLoadComplete]);
  
  // Terminal typing effect with enhanced content
  const startTypingEffect = useCallback(() => {
    if (isTyping) return; // Prevent multiple instances
    
    setIsTyping(true);
    let lineIndex = 0;
    let charIndex = 0;
    let currentText = '';
    
    // Enhanced terminal content with more technical details
    const enhancedTerminalLines = [
      'PROSPERA NEURAL INTERFACE v4.5.7',
      '> SYSTEM BOOT: INITIALIZING QUANTUM CORES...',
      '> NEURAL PATHWAY CALIBRATION: 98.7% COMPLETE',
      '> ESTABLISHING DIMENSIONAL MATRICES... [SUCCESS]',
      '> CALIBRATING CONSCIOUSNESS INTERFACE... [SUCCESS]',
      '> ACTIVATING QUANTUM ENTANGLEMENT... [SUCCESS]',
      '> NEURAL SYSTEM ONLINE',
      '> SYNCHRONIZATION RATE: 99.9998%',
      '',
      '> AWAITING NEURAL CONNECTION...'
    ];
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // For reduced motion preference, show all text immediately
      setTerminalText(enhancedTerminalLines.join('\n'));
      setIsTyping(false);
      return;
    }
    
    const typeNextChar = () => {
      if (lineIndex >= enhancedTerminalLines.length) {
        setIsTyping(false);
        return;
      }
      
      const currentLine = enhancedTerminalLines[lineIndex];
      
      if (charIndex < currentLine.length) {
        currentText += currentLine.charAt(charIndex);
        setTerminalText(currentText);
        charIndex++;
        // Randomize typing speed for realistic effect
        setTimeout(typeNextChar, Math.random() * 40 + 20);
      } else {
        currentText += '\n';
        setTerminalText(currentText);
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNextChar, 500);
      }
    };
    
    typeNextChar();
  }, [isTyping]);
  
  // Matrix quote rotation
  useEffect(() => {
    if (!isLoaded) return;
    
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % matrixQuotes.length);
    }, 5000);
    
    return () => clearInterval(quoteInterval);
  }, [matrixQuotes.length, isLoaded]);
  
  // Effect for countdown timer
  useEffect(() => {
    const targetDate = new Date('2025-05-31T00:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle scroll events with optimized performance
  useEffect(() => {
    // Skip if not loaded yet
    if (!isLoaded) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Update active section based on scroll position
      const sectionIds = Object.keys(sectionRefs.current);
      
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const section = sectionRefs.current[id];
        
        if (!section) continue;
        
        const rect = section.getBoundingClientRect();
        
        // Consider a section active when it's top part is in viewport
        if (rect.top <= 200 && rect.bottom >= 200) {
          if (activeSection !== id) {
            setActiveSection(id);
            trackEvent('section_viewed', { section: id });
          }
          break;
        }
      }
    };
    
    // Throttle scroll handler for better performance
    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [isLoaded, activeSection]);
  
  // Handle discovery of a section with enhanced logging
  const handleDiscoverSection = useCallback((sectionName: keyof typeof discoveredSections) => {
    console.log(`Discovering section: ${sectionName}`); // Debug log
    
    setDiscoveredSections(prev => {
      if (prev[sectionName]) {
        console.log(`Section ${sectionName} already discovered`); // Debug log
        return prev; // Already discovered
      }
      
      console.log(`Setting ${sectionName} to discovered`); // Debug log
      trackEvent('section_discovered', { section: sectionName });
      
      return {
        ...prev,
        [sectionName]: true
      };
    });
  }, []);
  
  // Handle wormhole transition with enhanced logging
  const handleWormholeTriggered = useCallback((destination: string) => {
    console.log(`Wormhole triggered to: ${destination}`); // Debug log
    setWormholeDestination(destination);
    setWormholeActive(true);
    
    trackEvent('wormhole_triggered', { destination });
  }, []);
  
  // Handle wormhole transition complete with enhanced logging
  const handleWormholeComplete = useCallback(() => {
    console.log(`Wormhole transition complete to: ${wormholeDestination}`); // Debug log
    setWormholeActive(false);
    
    // Scroll to appropriate section after transition
    setTimeout(() => {
      const sectionMap: {[key: string]: string} = {
        'Quantum Capabilities': 'features',
        'Neural Protocol': 'howItWorks',
        'Quantum Database': 'faq'
      };
      
      const sectionId = sectionMap[wormholeDestination];
      console.log(`Attempting to scroll to section: ${sectionId}`); // Debug log
      
      if (sectionId && sectionRefs.current[sectionId]) {
        console.log(`Scrolling to ${sectionId}`); // Debug log
        sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn(`Section not found: ${sectionId}`); // Debug log
      }
    }, 100);
  }, [wormholeDestination]);
  
  // Handle modal open
  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true);
    trackEvent('modal_opened', { type: 'signup' });
  }, []);
  
  // Handle successful signup
  const handleSignupSuccess = useCallback(() => {
    // Decrease available spots, but never below 1
    setRemainingSpots(prev => Math.max(1, prev - 1));
    setIsModalOpen(false);
    
    trackEvent('signup_complete', { remainingSpots: remainingSpots - 1 });
  }, [remainingSpots]);
  
  // Map discovery hotspots to their corresponding sections and positions
  const discoveryHotspots = useMemo(() => [
    { 
      id: 'features-hotspot',
      position: interactionPoints[0],
      theme: interactionPoints[0].theme as any,
      pulseColor: 'rgba(0, 255, 166, 0.8)',
      size: 120,
      label: 'Quantum Capabilities',
      onDiscover: () => handleDiscoverSection('features'),
      discovered: discoveredSections.features,
      onWormholeTriggered: handleWormholeTriggered
    },
    { 
      id: 'how-it-works-hotspot',
      position: interactionPoints[1],
      theme: interactionPoints[1].theme as any,
      pulseColor: 'rgba(0, 204, 255, 0.8)',
      size: 120,
      label: 'Neural Protocol',
      onDiscover: () => handleDiscoverSection('howItWorks'),
      discovered: discoveredSections.howItWorks,
      onWormholeTriggered: handleWormholeTriggered
    },
    { 
      id: 'faq-hotspot',
      position: interactionPoints[2],
      theme: interactionPoints[2].theme as any,
      pulseColor: 'rgba(119, 0, 255, 0.8)',
      size: 120,
      label: 'Quantum Database',
      onDiscover: () => handleDiscoverSection('faq'),
      discovered: discoveredSections.faq,
      onWormholeTriggered: handleWormholeTriggered
    }
  ], [discoveredSections, handleDiscoverSection, handleWormholeTriggered, interactionPoints]);

  // Custom loading screen
  if (isAppLoading) {
    return <Loading 
      messages={[
        'Initializing neural interface...',
        'Establishing quantum connection...',
        'Synchronizing dimensional matrices...',
        'Calibrating neural pathways...',
        'Accessing digital consciousness...'
      ]}
    />;
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white matrix-container matrix-scanlines">
      {/* Neural Particle Background */}
      <div className="neural-particle-system" style={{ position: 'fixed', inset: 0, zIndex: 5 }}>
        <NeuralParticleSystem 
          density={100} 
          interactive={true} 
          colorScheme="green"
          matrixEffect={true}
          dataTransferEffect={true}
          codeFragmentDensity={50}
          pulseNodes={true}
          enableGlow={true}
        />
      </div>
      
      {/* Interactive Stellar Map with discoverable points */}
      <div className="discovery-map-container" style={{ position: 'relative', width: '100%', height: '100vh', zIndex: 10 }}>
        <InteractiveStellarMap 
          theme="green"
          matrixEffect={true}
          interactive={true}
          codeFragmentDensity={30}
          density={50}
        >
          {discoveryHotspots.map((hotspot) => (
            <DiscoveryHotspot 
              key={hotspot.id}
              id={hotspot.id}
              position={hotspot.position}
              pulseColor={hotspot.pulseColor}
              size={hotspot.size}
              label={hotspot.label}
              onDiscover={hotspot.onDiscover}
              discovered={hotspot.discovered}
              showCodeEffect={true}
              theme={hotspot.theme}
              onWormholeTriggered={hotspot.onWormholeTriggered}
            />
          ))}
        </InteractiveStellarMap>
      </div>
      
      {/* Simplified header with expanded terminal */}
      <div className="fixed top-0 left-0 w-full z-50 transition-all duration-500 py-6 bg-[#000300]/85 backdrop-blur border-b border-[--matrix-border] shadow-[0_10px_30px_rgba(0,0,0,0.2),0_0_10px_var(--matrix-glow-subtle)]">
        <div className="container mx-auto px-6">
          {/* Terminal in header - expanded */}
          <div className="matrix-terminal mx-auto" ref={terminalRef} style={{ maxWidth: '800px', margin: '0 auto', minHeight: '100px' }}>
            <pre className="text-sm md:text-base text-left overflow-x-auto whitespace-pre-wrap break-words">
              {terminalText}
              {isTyping && <span className="inline-block w-3 h-5 bg-[var(--matrix-green-primary)] animate-pulse ml-1" aria-hidden="true"></span>}
            </pre>
          </div>
        </div>
      </div>
      
      {/* Hero Section - Adding minimal floating controls */}
      <section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center py-20 z-10"
        ref={el => sectionRefs.current.hero = el}
      >
        {/* Floating controls */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-4">
          <button
            className="matrix-button py-3 px-6 text-black font-bold bg-[var(--matrix-green-primary)] rounded-lg shadow-[0_0_20px_var(--matrix-glow)] hover:shadow-[0_0_30px_var(--matrix-glow-intense)] transition-all duration-300 hover:translate-y-[-4px)] uppercase tracking-wide"
            onClick={handleModalOpen}
            aria-label="Neural Link"
          >
            Neural Link
          </button>
          
          <button
            className="matrix-button-alt py-3 px-6 text-[var(--matrix-green-primary)] font-bold bg-[rgba(0,0,0,0.5)] border border-[var(--matrix-green-primary)] rounded-lg hover:bg-[rgba(0,255,102,0.1)] shadow-[0_0_15px_var(--matrix-glow-subtle)] hover:shadow-[0_0_25px_var(--matrix-glow)] transition-all duration-300 hover:translate-y-[-4px)] uppercase tracking-wide"
            onClick={() => {
              const el = document.querySelector('.discovery-map-container');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Neural Map"
          >
            Neural Map
          </button>
        </div>
      </section>
      
      {/* Features Section - Hidden until discovered */}
      {discoveredSections.features && (
        <SectionContainer
          id="features"
          title="Quantum Capabilities"
          theme="green"
          isVisible={discoveredSections.features}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="matrix-terminal bg-[var(--matrix-bg-terminal)]/30 border border-[var(--matrix-border)] rounded-lg p-8 shadow-lg transform transition-transform hover:translate-y-[-8px] hover:shadow-[0_15px_35px_rgba(0,0,0,0.2),0_0_15px_var(--matrix-glow-subtle)]">
              <h3 className="text-[var(--matrix-green-primary)] text-2xl font-bold mb-4 matrix-glow">Synaptic Exchange</h3>
              <p className="text-[#8A98B8]">Neural quantum harmonization at 15.7 petahertz, enabling simultaneous multi-dimensional processing across parallel information streams.</p>
            </div>
            
            <div className="matrix-terminal bg-[var(--matrix-bg-terminal)]/30 border border-[var(--matrix-border)] rounded-lg p-8 shadow-lg transform transition-transform hover:translate-y-[-8px] hover:shadow-[0_15px_35px_rgba(0,0,0,0.2),0_0_15px_var(--matrix-glow-subtle)]">
              <h3 className="text-[var(--matrix-green-primary)] text-2xl font-bold mb-4 matrix-glow">Neural Amplification</h3>
              <p className="text-[#8A98B8]">Exponential cognitive enhancement through quantum field manipulation, resulting in N+1 dimensional thought acceleration.</p>
            </div>
            
            <div className="matrix-terminal bg-[var(--matrix-bg-terminal)]/30 border border-[var(--matrix-border)] rounded-lg p-8 shadow-lg transform transition-transform hover:translate-y-[-8px] hover:shadow-[0_15px_35px_rgba(0,0,0,0.2),0_0_15px_var(--matrix-glow-subtle)]">
              <h3 className="text-[var(--matrix-green-primary)] text-2xl font-bold mb-4 matrix-glow">Quantum Entanglement</h3>
              <p className="text-[#8A98B8]">Instant data transmission across all connected neural nodes with zero latency, achieving perfect synchronization regardless of physical distance.</p>
            </div>
          </div>
        </SectionContainer>
      )}
      
      {/* How It Works Section - Hidden until discovered */}
      {discoveredSections.howItWorks && (
        <SectionContainer
          id="how-it-works"
          title="Neural Protocol"
          theme="blue"
          isVisible={discoveredSections.howItWorks}
        >
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row items-center gap-6 transform transition hover:translate-x-2">
              <div className="w-20 h-20 shrink-0 rounded-full bg-gradient-to-br from-[var(--matrix-green-primary)] to-[var(--matrix-cyan)] flex items-center justify-center text-2xl font-bold shadow-[0_0_20px_var(--matrix-glow)]">1</div>
              <div className="flex-1 matrix-terminal bg-[var(--matrix-bg-terminal)]/30 border border-[var(--matrix-border)] rounded-lg p-6 shadow-lg">
                <h3 className="text-[var(--matrix-green-primary)] text-xl font-bold mb-3 matrix-glow">Neural Calibration</h3>
                <p className="text-[#8A98B8]">Complete a 3-minute quantum resonance scan to establish your unique neural signature. This allows the system to calibrate to your specific brainwave patterns.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 transform transition hover:translate-x-2">
              <div className="w-20 h-20 shrink-0 rounded-full bg-gradient-to-br from-[var(--matrix-blue)] to-[var(--matrix-purple)] flex items-center justify-center text-2xl font-bold shadow-[0_0_20px_rgba(0,136,255,0.5)]">2</div>
              <div className="flex-1 matrix-terminal bg-[var(--matrix-bg-terminal)]/30 border border-[var(--matrix-border)] rounded-lg p-6 shadow-lg">
                <h3 className="text-[var(--matrix-cyan)] text-xl font-bold mb-3 matrix-glow">Quantum Entanglement</h3>
                <p className="text-[#8A98B8]">Establish a secure quantum link between your consciousness and the PROSPERA neural network. This connection operates outside traditional spacetime constraints.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 transform transition hover:translate-x-2">
              <div className="w-20 h-20 shrink-0 rounded-full bg-gradient-to-br from-[var(--matrix-purple)] to-[var(--matrix-green-primary)] flex items-center justify-center text-2xl font-bold shadow-[0_0_20px_rgba(136,85,255,0.5)]">3</div>
              <div className="flex-1 matrix-terminal bg-[var(--matrix-bg-terminal)]/30 border border-[var(--matrix-border)] rounded-lg p-6 shadow-lg">
                <h3 className="text-[var(--matrix-purple)] text-xl font-bold mb-3 matrix-glow">Neural Integration</h3>
                <p className="text-[#8A98B8]">Experience the seamless fusion of your consciousness with the collective neural matrix. Access enhanced cognitive capabilities with 99.9998% synchronization accuracy.</p>
              </div>
            </div>
          </div>
        </SectionContainer>
      )}
      
      {/* FAQ Section - Hidden until discovered */}
      {discoveredSections.faq && (
        <SectionContainer
          id="faq"
          title="Quantum Database"
          theme="purple"
          isVisible={discoveredSections.faq}
        >
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="matrix-terminal bg-[var(--matrix-bg-terminal)]/30 border border-[var(--matrix-border)] rounded-lg p-6 shadow-lg transform transition-transform hover:scale-[1.01] hover:shadow-[0_15px_35px_rgba(0,0,0,0.2),0_0_15px_var(--matrix-glow-subtle)]">
              <h3 className="text-[var(--matrix-green-primary)] text-xl font-bold mb-3 matrix-glow">Is neural integration safe?</h3>
              <p className="text-[#8A98B8]">Yes. Our quantum harmonization protocols ensure perfect neural synchronization without interference. The 99.9998% synchronization rate represents the highest safety standard in the industry.</p>
            </div>
            
            <div className="matrix-terminal bg-[var(--matrix-bg-terminal)]/30 border border-[var(--matrix-border)] rounded-lg p-6 shadow-lg transform transition-transform hover:scale-[1.01] hover:shadow-[0_15px_35px_rgba(0,0,0,0.2),0_0_15px_var(--matrix-glow-subtle)]">
              <h3 className="text-[var(--matrix-green-primary)] text-xl font-bold mb-3 matrix-glow">What are the system requirements?</h3>
              <p className="text-[#8A98B8]">The PROSPERA interface requires no special hardware. Our quantum field manipulators operate through non-local consciousness connections, requiring only your baseline neural activity.</p>
            </div>
            
            <div className="matrix-terminal bg-[var(--matrix-bg-terminal)]/30 border border-[var(--matrix-border)] rounded-lg p-6 shadow-lg transform transition-transform hover:scale-[1.01] hover:shadow-[0_15px_35px_rgba(0,0,0,0.2),0_0_15px_var(--matrix-glow-subtle)]">
              <h3 className="text-[var(--matrix-green-primary)] text-xl font-bold mb-3 matrix-glow">How long does neural integration last?</h3>
              <p className="text-[#8A98B8]">Once established, your quantum entanglement with the PROSPERA network is permanent. Session duration is unlimited, though we recommend neural rest periods every 4-6 hours to optimize cognitive enhancement benefits.</p>
            </div>
            
            <div className="matrix-terminal bg-[var(--matrix-bg-terminal)]/30 border border-[var(--matrix-border)] rounded-lg p-6 shadow-lg transform transition-transform hover:scale-[1.01] hover:shadow-[0_15px_35px_rgba(0,0,0,0.2),0_0_15px_var(--matrix-glow-subtle)]">
              <h3 className="text-[var(--matrix-green-primary)] text-xl font-bold mb-3 matrix-glow">Why are spots limited?</h3>
              <p className="text-[#8A98B8]">The quantum coherence field can only maintain stability with a finite number of entangled consciousnesses. Exceeding this threshold would destabilize the N+1 dimensional matrix, potentially leading to neural desynchronization.</p>
            </div>
          </div>
        </SectionContainer>
      )}
      
      {/* Quantum Sidebar - Always visible but adjusted z-index */}
      <QuantumSidebar
        remainingSpots={remainingSpots}
        totalSpots={500}
        countdown={countdown}
        onButtonClick={handleModalOpen}
        alwaysVisible={true}
      />
      
      {/* Signup Modal */}
      {isModalOpen && (
        <SignupModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSignupSuccess}
          title="NEURAL INTERFACE CONNECTION"
          subtitle="Complete the neural synchronization protocol to establish quantum entanglement"
          submitButtonText="INITIALIZE NEURAL LINK"
          successTitle="NEURAL LINK ESTABLISHED"
          successMessage="Your consciousness has been successfully mapped to the PROSPERA network. Synchronization complete. Prepare for dimensional transcendence."
        />
      )}
      
      {/* Wormhole Transition */}
      <WormholeTransition 
        isActive={wormholeActive}
        destination={wormholeDestination}
        onTransitionComplete={handleWormholeComplete}
      />
      
      {/* Accessibility focus traps */}
      <div id="portal-root"></div> {/* For modal portals */}
      <div id="skip-content" tabIndex={-1} className="sr-only">Main content</div>
    </main>
  );
}