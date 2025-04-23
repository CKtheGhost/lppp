// src/styles/motion.ts

export const transitions = {
  // Base transitions
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
  
  // Slide transitions
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
  
  slideDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
  
  slideRight: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
  
  // Scale transitions
  scaleUp: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
  
  scaleDown: {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
  
  // Reveal transitions
  reveal: {
    initial: { clipPath: 'inset(0 100% 0 0)' },
    animate: { clipPath: 'inset(0 0% 0 0)' },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
  },
  
  // Stagger children
  stagger: {
    animate: { transition: { staggerChildren: 0.1 } }
  },
  
  // Special effects
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  },
  
  glow: {
    initial: { opacity: 0, filter: 'brightness(1) drop-shadow(0 0 0 rgba(0,255,102,0))' },
    animate: { opacity: 1, filter: 'brightness(1.1) drop-shadow(0 0 10px rgba(0,255,102,0.5))' },
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  }
};

export const easing = {
  // Custom easing functions
  quantum: [0.16, 1, 0.3, 1],
  bounce: [0.175, 0.885, 0.32, 1.275],
  elastic: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.43, 0.13, 0.23, 0.96]
};

export const durations = {
  fastest: 0.1,
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  slower: 1.2,
  slowest: 2
};

// Helper functions for animation sequences
export const sequence = (delay = 0, interval = 0.1) => ({
  staggerChildren: interval,
  delayChildren: delay
});

export const animation = {
  transitions,
  easing,
  durations,
  sequence
};

export default animation;