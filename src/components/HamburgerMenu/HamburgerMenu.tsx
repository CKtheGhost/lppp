'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './HamburgerMenu.module.css';

export interface NavItem {
  id: string;
  label: string;
  link?: string;
  onClick?: () => void;
}

export interface SocialLink {
  label: string;
  icon: React.ReactNode;
  url: string;
}

export interface HamburgerMenuProps {
  onJoinClick: () => void;
  navigationItems?: NavItem[];
  ctaLabel?: string;
  socialLinks?: SocialLink[];
  logoText?: string;
  darkMode?: boolean;
  position?: 'left' | 'right';
}

const defaultNavItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    link: '#hero'
  },
  {
    id: 'features',
    label: 'Quantum Capabilities',
    link: '#features'
  },
  {
    id: 'protocol',
    label: 'Neural Protocol',
    link: '#how-it-works'
  },
  {
    id: 'database',
    label: 'Quantum Database',
    link: '#faq'
  }
];

const defaultSocialLinks: SocialLink[] = [
  {
    label: 'Twitter',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
      </svg>
    ),
    url: '#'
  },
  {
    label: 'Discord',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 9a5 5 0 0 0-5-5H9.5a5 5 0 0 0-5 5v6a5 5 0 0 0 5 5H14"></path>
        <path d="M16 8l3 3-3 3"></path>
      </svg>
    ),
    url: '#'
  },
  {
    label: 'Telegram',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13"></path>
        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
      </svg>
    ),
    url: '#'
  }
];

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  onJoinClick,
  navigationItems = defaultNavItems,
  ctaLabel = 'Join Early Access',
  socialLinks = defaultSocialLinks,
  logoText = 'PROSPERA',
  darkMode = true,
  position = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  
  // Handle menu toggle
  const toggleMenu = () => {
    if (firstRender.current) {
      firstRender.current = false;
    }
    setIsOpen(prev => !prev);
  };
  
  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    // Prevent body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!firstRender.current) {
      // Only change body style after initial render
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Update active menu item based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Find the section that is currently in view
      let currentSection = '';
      navigationItems.forEach(item => {
        if (!item.link || !item.link.startsWith('#')) return;
        
        const section = document.querySelector(item.link);
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          currentSection = item.id;
        }
      });
      
      setActiveItemId(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigationItems]);
  
  // Handle nav item click
  const handleNavItemClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
    }
    
    if (item.link) {
      // Smooth scroll to section
      const element = document.querySelector(item.link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    setIsOpen(false);
  };
  
  // Render navigation items
  const renderNavItems = () => {
    return navigationItems.map((item, index) => (
      <li 
        key={item.id}
        className={`${styles.navItem} ${activeItemId === item.id ? styles.active : ''}`}
        style={{ transitionDelay: `${index * 50 + 100}ms` }}
      >
        <button
          className={styles.navLink}
          onClick={() => handleNavItemClick(item)}
          aria-current={activeItemId === item.id ? 'page' : undefined}
        >
          <span className={styles.navItemIcon}>
            <svg 
              className={styles.navItemIconSvg} 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 2L2 7L12 12L22 7L12 2Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M2 17L12 22L22 17" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M2 12L12 17L22 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className={styles.navItemText}>{item.label}</span>
        </button>
      </li>
    ));
  };
  
  // Render social links
  const renderSocialLinks = () => {
    return socialLinks.map((link, index) => (
      <a 
        key={link.label}
        href={link.url}
        className={styles.socialIcon}
        aria-label={link.label}
        target="_blank"
        rel="noopener noreferrer"
        style={{ transitionDelay: `${index * 50 + 200}ms` }}
      >
        {link.icon}
        <span className={styles.socialGlow}></span>
      </a>
    ));
  };

  return (
    <div 
      className={`
        ${styles.hamburgerMenuContainer} 
        ${darkMode ? styles.darkMode : styles.lightMode}
        ${position === 'left' ? styles.positionLeft : styles.positionRight}
      `} 
      ref={menuRef}
    >
      {/* Hamburger button */}
      <button 
        className={`${styles.hamburgerButton} ${isOpen ? styles.open : ''}`}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="Main menu"
        aria-controls="mobile-menu"
      >
        <div className={styles.hamburgerGlow}></div>
        <span className={styles.hamburgerBar}></span>
        <span className={styles.hamburgerBar}></span>
        <span className={styles.hamburgerBar}></span>
      </button>
      
      {/* Mobile menu */}
      <div 
        id="mobile-menu"
        className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}
        aria-hidden={!isOpen}
      >
        <div className={styles.menuHeader}>
          <span className={styles.logoText}>{logoText}</span>
        </div>
        
        <nav className={styles.mobileNav} aria-label="Main navigation">
          <ul>{renderNavItems()}</ul>
        </nav>
        
        <div className={styles.mobileCtaContainer}>
          <button 
            className={styles.mobileCta}
            onClick={() => {
              setIsOpen(false);
              onJoinClick();
            }}
          >
            {ctaLabel}
            <span className={styles.ctaGlow}></span>
          </button>
        </div>
        
        <div className={styles.mobileSocial}>
          {renderSocialLinks()}
        </div>
        
        {/* Neural particle background effect */}
        <div className={styles.neuralParticles} aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => (
            <div 
              key={index} 
              className={styles.neuralParticle}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`
              }}
            ></div>
          ))}
        </div>
        
        {/* Background gradient */}
        <div className={styles.menuGradient} aria-hidden="true"></div>
      </div>
      
      {/* Menu backdrop/overlay */}
      <div 
        className={`${styles.menuBackdrop} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      >
        <div className={styles.backdropGlow}></div>
      </div>
    </div>
  );
};

export default HamburgerMenu;