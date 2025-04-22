'use client'

import { useState, useEffect } from 'react';
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
      // Add/remove class to header when scrolled
      const header = document.querySelector('.header');
      const scrollProgress = document.getElementById('scroll-progress');
      
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
      
      // Update scroll progress bar
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
    <main>
      {/* Header */}
      <header className="header">
        <div className="container">
          <a href="/" className="logo" aria-label="PROSPERA Home">
            <div className="logo-icon"></div>
            <span className="logo-text">PROSPERA</span>
            <div className="logo-glow"></div>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#benefits">Benefits</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </nav>
          <button className="btn-primary btn-glow header-join-cta" onClick={() => setIsModalOpen(true)}>
            Join Early Access
          </button>
          <HamburgerMenu onJoinClick={() => setIsModalOpen(true)} />
        </div>
      </header>
      
      {/* Hero Section */}
      <HeroSection onJoinClick={() => setIsModalOpen(true)} />
      
      {/* Counter & Countdown section */}
      <section className="early-access-counter-section">
        <div className="container">
          <div className="counter-countdown-grid">
            <div className="counter-column">
              <QuantumCounter 
                remainingSpots={remainingSpots} 
                totalSpots={500} 
                onButtonClick={() => setIsModalOpen(true)} 
              />
            </div>
            <div className="countdown-column">
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
      <section className="final-cta">
        <div className="container">
          <div className="final-cta-content">
            <h2>Ready to Experience the Future?</h2>
            <p>Join our exclusive early access program today and be part of the quantum revolution.</p>
            <button className="cta-button btn-quantum final-join-cta" onClick={() => setIsModalOpen(true)}>
              Get Early Access
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h3>PROSPERA</h3>
              <p>Disrupting the $4.1T hedge fund industry with AI-driven crypto trading technology.</p>
            </div>
            <div className="footer-column">
              <h4>Connect With Us</h4>
              <ul>
                <li><a href="mailto:contact@prosperadefi.com">contact@prosperadefi.com</a></li>
                <li><a href="https://twitter.com/ProsperaDefi">@ProsperaDefi</a></li>
                <li><a href="https://discord.gg/prospera">discord.gg/prospera</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 PROSPERA. All rights reserved.</p>
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
      {!cookieConsent && (
        <div id="cookie-consent" className="cookie-consent active">
          <div className="cookie-content">
            <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
            <div className="cookie-buttons">
              <button className="cookie-settings">Cookie Settings</button>
              <button className="cookie-accept" onClick={acceptCookies}>Accept</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Scroll Progress */}
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar" id="scroll-progress"></div>
      </div>
    </main>
  );
}