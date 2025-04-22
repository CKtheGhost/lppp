'use client'

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import HeroSection from '@/components/HeroSection/HeroSection';
import FeaturesSection from '@/components/FeaturesSection/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection/HowItWorksSection';
import FAQSection from '@/components/FAQSection/FAQSection';
import QuantumCounter from '@/components/QuantumCounter/QuantumCounter';
import QuantumCountdown from '@/components/QuantumCountdown/QuantumCountdown';
import SignupModal from '@/components/SignupModal/SignupModal';
import HamburgerMenu from '@/components/HamburgerMenu/HamburgerMenu';
import { PROSPERA_PERFORMANCE } from '@/utils/performanceUtils';
import styles from './page.module.css';

export default function Home() {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remainingSpots, setRemainingSpots] = useState(273);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  
  // Intersection observer hooks for animations
  const { ref: featuresRef, inView: featuresInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: stepsRef, inView: stepsInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: faqRef, inView: faqInView } = useInView({ threshold: 0.2, triggerOnce: true });
  
  // Initialize cookie consent from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCookieConsent(localStorage.getItem('cookieConsent') === 'true');
    }
  }, []);
  
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
  
  // Initialize performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined') {
      PROSPERA_PERFORMANCE.mark('reactMounted');
      PROSPERA_PERFORMANCE.hideLoadingOverlay(600);
    }
  }, []);
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // Update header state when scrolled
      if (window.scrollY > 50) {
        setIsHeaderScrolled(true);
      } else {
        setIsHeaderScrolled(false);
      }
      
      // Update scroll progress bar
      const scrollProgress = document.getElementById('scroll-progress');
      if (scrollProgress) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Random counter decrement
  useEffect(() => {
    const decrementInterval = setInterval(() => {
      if (remainingSpots > 50) {
        if (Math.random() < 0.3) {
          const amount = Math.floor(Math.random() * 3) + 1;
          decrementCounter(amount);
        }
      }
    }, 60000);
    
    return () => clearInterval(decrementInterval);
  }, [remainingSpots]);
  
  // Decrement counter
  const decrementCounter = (amount: number) => {
    setRemainingSpots(prev => {
      const newValue = Math.max(1, prev - amount);
      return newValue;
    });
  };
  
  // Accept cookies
  const acceptCookies = () => {
    setCookieConsent(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', 'true');
    }
  };

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={`${styles.header} ${isHeaderScrolled ? styles.scrolled : ''}`}>
        <div className={styles.headerContainer}>
          <a href="/" className={styles.logo} aria-label="PROSPERA Home">
            <div className={styles.logoIcon}></div>
            <span className={styles.logoText}>PROSPERA</span>
            <div className={styles.logoGlow}></div>
          </a>
          <nav className={styles.mainNav} aria-label="Main navigation">
            <ul className={styles.navList}>
              <li className={styles.navItem}><a className={styles.navLink} href="#features">Features</a></li>
              <li className={styles.navItem}><a className={styles.navLink} href="#benefits">Benefits</a></li>
              <li className={styles.navItem}><a className={styles.navLink} href="#how-it-works">How It Works</a></li>
              <li className={styles.navItem}><a className={styles.navLink} href="#faq">FAQ</a></li>
            </ul>
          </nav>
          <button className={`${styles.headerJoinCta} ${styles.btnGlow}`} onClick={() => setIsModalOpen(true)}>
            Join Early Access
          </button>
          <HamburgerMenu onJoinClick={() => setIsModalOpen(true)} />
        </div>
      </header>
      
      {/* Hero Section */}
      <HeroSection onJoinClick={() => setIsModalOpen(true)} />
      
      {/* Counter & Countdown section */}
      <section className={styles.earlyAccessSection}>
        <div className={styles.container}>
          <div className={styles.counterGrid}>
            <div>
              <QuantumCounter 
                remainingSpots={remainingSpots} 
                totalSpots={500} 
                onButtonClick={() => setIsModalOpen(true)} 
              />
            </div>
            <div>
              <QuantumCountdown 
                countdown={countdown} 
                onButtonClick={() => setIsModalOpen(true)} 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <div ref={featuresRef}>
        <FeaturesSection inView={featuresInView} />
      </div>
      
      {/* How it works section */}
      <div ref={stepsRef}>
        <HowItWorksSection 
          inView={stepsInView}
          onJoinClick={() => setIsModalOpen(true)}
        />
      </div>
      
      {/* FAQ section */}
      <div ref={faqRef}>
        <FAQSection inView={faqInView} />
      </div>
      
      {/* Final CTA section */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.finalCtaContent}>
            <h2 className={styles.finalCtaTitle}>Ready to Experience the Future?</h2>
            <p className={styles.finalCtaText}>Join our exclusive early access program today and be part of the quantum revolution.</p>
            <button className={styles.finalJoinCta} onClick={() => setIsModalOpen(true)}>
              Get Early Access
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerColumn}>
              <h3>PROSPERA</h3>
              <p className={styles.footerColumnText}>Disrupting the $4.1T hedge fund industry with AI-driven crypto trading technology.</p>
            </div>
            <div className={styles.footerColumn}>
              <h4>Connect With Us</h4>
              <ul className={styles.footerLinksList}>
                <li className={styles.footerLinkItem}>
                  <a href="mailto:contact@prosperadefi.com" className={styles.footerLink}>
                    <svg className={styles.footerLinkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    contact@prosperadefi.com
                  </a>
                </li>
                <li className={styles.footerLinkItem}>
                  <a href="https://twitter.com/ProsperaDefi" className={styles.footerLink}>
                    <svg className={styles.footerLinkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                    @ProsperaDefi
                  </a>
                </li>
                <li className={styles.footerLinkItem}>
                  <a href="https://discord.gg/prospera" className={styles.footerLink}>
                    <svg className={styles.footerLinkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 18V6c0-1.1-.9-2-2-2H5C3.9 4 3 4.9 3 6v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2Z"></path>
                      <path d="M9 10c1.1 0 2-.9 2-2H7c0 1.1.9 2 2 2Z"></path>
                      <path d="M15 10c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2Z"></path>
                      <path d="M10 14c0 1.1.9 2 2 2s2-.9 2-2"></path>
                    </svg>
                    discord.gg/prospera
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className={styles.footerCopyright}>&copy; 2025 PROSPERA. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Signup Modal */}
      <SignupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          decrementCounter(1);
        }}
      />
      
      {/* Cookie Consent */}
      {cookieConsent === false && (
        <div className={`${styles.cookieConsent} ${cookieConsent === false ? styles.active : ''}`}>
          <div className={styles.cookieContent}>
            <p className={styles.cookieText}>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
            <div className={styles.cookieButtons}>
              <button className={styles.cookieSettings}>Cookie Settings</button>
              <button className={styles.cookieAccept} onClick={acceptCookies}>Accept</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Background Effects */}
      <div className={styles.glowEffect} aria-hidden="true">
        <div className={styles.glowCircle}></div>
        <div className={styles.glowCircle}></div>
        <div className={styles.glowCircle}></div>
      </div>
      
      {/* Scroll Progress */}
      <div className={styles.scrollProgressContainer}>
        <div className={styles.scrollProgressBar} id="scroll-progress"></div>
      </div>
    </main>
  );
}