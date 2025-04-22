// src/styles/design-tokens.ts

// Color system with semantic naming
export const colors = {
  // Primary colors
  primary: {
    default: '#00ff00',
    dark: '#00cc00',
    darker: '#009900',
    light: '#66ff66',
    muted: 'rgba(0, 255, 0, 0.5)'
  },
  // Secondary accent colors
  accent: {
    teal: '#0dca88',
    blue: '#0088ff',
    purple: '#8855ff'
  },
  // Background colors
  background: {
    default: '#030508',
    elevated: '#050A14',
    card: '#0B111E',
    hover: '#0D1524'
  },
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#8A98B8', 
    muted: '#616E88',
    highlight: '#00ff00'
  },
  // Functional colors
  functional: {
    error: '#ff3b3b',
    warning: '#ffbb00',
    success: '#00cc66',
    info: '#0088ff'
  },
  // Effects
  effects: {
    glow: 'rgba(0, 255, 0, 0.5)',
    border: 'rgba(0, 255, 0, 0.15)',
    overlay: 'rgba(3, 5, 8, 0.8)'
  }
};

// Spacing system (based on 4px grid)
export const spacing = {
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px', 
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
  huge: '96px'
};

// Typography
export const typography = {
  // Font families
  fontFamily: {
    sans: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    mono: `'JetBrains Mono', Menlo, Monaco, Consolas, 'Courier New', monospace`,
    display: `'Audiowide', sans-serif`
  },
  // Font sizes (with responsive variants)
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem'    // 72px
  },
  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  }
};

// Borders
export const borders = {
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  },
  width: {
    none: '0',
    thin: '1px',
    thick: '2px',
    thicker: '4px'
  }
};

// Shadows
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
  glow: '0 0 15px rgba(0, 255, 0, 0.5)',
  glow2x: '0 0 30px rgba(0, 255, 0, 0.3)',
  none: 'none'
};

// Z-index utility
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  raised: 1,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
  maximum: 9999
};

// Animation timing
export const animation = {
  durations: {
    instant: '0ms',
    fastest: '100ms',
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms'
  },
  easings: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    quantum: 'cubic-bezier(0.16, 1, 0.3, 1)'
  }
};

// Breakpoints for responsive design
export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Media queries helper
export const media = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  
  // Custom media queries
  hover: `@media (hover: hover)`,
  dark: `@media (prefers-color-scheme: dark)`,
  light: `@media (prefers-color-scheme: light)`,
  reducedMotion: `@media (prefers-reduced-motion: reduce)`
};
