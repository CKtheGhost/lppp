'use client'

import { useRef } from 'react';
import styles from './HowItWorksSection.module.css';

interface HowItWorksSectionProps {
  inView: boolean;
  onJoinClick: () => void;
}

const HowItWorksSection = ({ inView, onJoinClick }: HowItWorksSectionProps) => {
  const steps = [
    {
      number: 1,
      title: "Apply For Early Access",
      description: "Complete our early access application form with your details and investment experience. We're carefully selecting participants to ensure a diverse and engaged community of early adopters."
    },
    {
      number: 2,
      title: "Receive Your Invitation",
      description: "Selected applicants will receive an exclusive invitation via email with a unique access code and detailed instructions for setting up your PROSPERA early access account."
    },
    {
      number: 3,
      title: "Complete Onboarding",
      description: "Follow our comprehensive onboarding process including KYC verification, wallet setup, and platform introduction. Our dedicated support team will guide you through each step."
    },
    {
      number: 4,
      title: "Gain Platform Access",
      description: "Start exploring PROSPERA's revolutionary features powered by our Omnimind_Nexus AI system. Experience institutional-grade trading strategies with unprecedented 99.9998% success rate."
    },
    {
      number: 5,
      title: "Provide Valuable Feedback",
      description: "Share your experience and suggestions to help shape the future of PROSPERA. Your insights during the early access phase will directly influence our development priorities."
    }
  ];

  return (
    <section id="how-it-works" className={styles.howItWorks}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Early Access Journey</h2>
          <p className={styles.sectionSubtitle}>Your pathway to revolutionary AI-powered investment strategies begins with these simple steps.</p>
        </div>

        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className={`${styles.step} ${inView ? styles.animate : ''}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={styles.stepNumber} aria-hidden="true">{step.number}</div>
              <div className={styles.stepContent}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <div className={styles.stepConnector} aria-hidden="true"></div>
            </div>
          ))}
        </div>
        
        <div className={styles.journeyCta}>
          <button 
            className={styles.ctaButton} 
            onClick={onJoinClick}
          >
            Start Your Journey
            <span className={styles.buttonGlow}></span>
          </button>
        </div>
      </div>
      
      <div className={styles.backgroundEffects} aria-hidden="true">
        <div className={styles.glowOrb}></div>
        <div className={styles.gridLines}></div>
      </div>
    </section>
  );
};

export default HowItWorksSection;