'use client'

import { useRef } from 'react';
import styles from './FeaturesSection.module.css';

interface FeaturesSectionProps {
  inView: boolean;
}

const FeaturesSection = ({ inView }: FeaturesSectionProps) => {
  const featuresRef = useRef<HTMLDivElement>(null);

  return (
    <section id="features" className={styles.features} ref={featuresRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Revolutionary Features</h2>
          <p className={styles.sectionSubtitle}>PROSPERA combines cutting-edge AI technology with secure blockchain infrastructure to democratize access to sophisticated trading strategies previously reserved for elite clientele.</p>
        </div>
        
        <div className={styles.featuresGrid}>
          <div className={`${styles.featureCard} ${inView ? styles.animate : ''}`} style={{ animationDelay: '0.1s' }}>
            <div className={styles.featureIcon} aria-hidden="true">
              <div className={styles.featureIconWrap}>
                <div className={styles.featureIconInner}>
                  <svg width="36" height="36" fill="currentColor" viewBox="0 0 640 512">
                    <path d="M576 64H64v288H33.2c-19.8 0-33.2 20.3-25.4 39.2l35.4 85.1c5.7 13.7 19.1 22.6 33.9 22.6h490.7c14.8 0 28.2-8.9 33.9-22.6l35.4-85.1c7.8-18.9-5.6-39.2-25.4-39.2H576V64zM64 224h96v-96h32v96h96v32h-96v96h-32v-96H64v-32zm384 32h-96v-96h-32v96h-96v32h96v96h32v-96h96v-32z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureBadge}>AI-Powered</span>
              <h3>Omnimind_Nexus AI</h3>
              <p>Our proprietary AI system leverages advanced algorithms to deliver institutional-grade trading strategies with unprecedented accuracy, analyzing market dynamics in real-time to optimize investment returns.</p>
            </div>
          </div>
          
          <div className={`${styles.featureCard} ${inView ? styles.animate : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.featureIcon} aria-hidden="true">
              <div className={styles.featureIconWrap}>
                <div className={styles.featureIconInner}>
                  <svg width="36" height="36" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M174.9 494.1c-18.7 18.7-49.1 18.7-67.9 0L14.9 401.9c-18.7-18.7-18.7-49.1 0-67.9l50.7-50.7L302.1 19.9c25-25 65.5-25 90.5 0l90.5 90.5c25 25 25 65.5 0 90.5L219.5 464.5l-44.6 29.6zM123.9 175.6L60.7 238.8c-6.2 6.2-6.2 16.4 0 22.6l20.2 20.2 45.3-45.3 29.4 29.4-45.3 45.3 20.2 20.2c6.2 6.2 16.4 6.2 22.6 0l63.2-63.2 113-113-90.5-90.5-113 113-1.9 1.9zm112 45.3l-29.4-29.4 79.8-79.8 29.4 29.4-79.8 79.8z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureBadge}>Community</span>
              <h3>Strategic Partnerships</h3>
              <p>Our platform integrates with multiple established Web3 partners including Retardio Casino, Fu Studios, SimpFi, and other key communities, creating a comprehensive ecosystem that drives user adoption and engagement.</p>
            </div>
          </div>
          
          <div className={`${styles.featureCard} ${inView ? styles.animate : ''}`} style={{ animationDelay: '0.3s' }}>
            <div className={styles.featureIcon} aria-hidden="true">
              <div className={styles.featureIconWrap}>
                <div className={styles.featureIconInner}>
                  <svg width="36" height="36" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2-.5 99.2-41.3 280.7-213.7 363.2-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureBadge}>Revenue</span>
              <h3>Tokenized Rewards</h3>
              <p>Our innovative staking architecture and tokenomics model provide multiple revenue streams for participants, with tiered staking options that include flexible and locked staking with revenue-sharing opportunities.</p>
            </div>
          </div>
          
          <div className={`${styles.featureCard} ${inView ? styles.animate : ''}`} style={{ animationDelay: '0.4s' }}>
            <div className={styles.featureIcon} aria-hidden="true">
              <div className={styles.featureIconWrap}>
                <div className={styles.featureIconInner}>
                  <svg width="36" height="36" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zm40-176c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureBadge}>Security</span>
              <h3>Advanced Security</h3>
              <p>Our platform incorporates enterprise-grade security protocols, ensuring the protection of user assets and data across our ecosystem with transparent processes and robust infrastructure.</p>
            </div>
          </div>
          
          <div className={`${styles.featureCard} ${inView ? styles.animate : ''}`} style={{ animationDelay: '0.5s' }}>
            <div className={styles.featureIcon} aria-hidden="true">
              <div className={styles.featureIconWrap}>
                <div className={styles.featureIconInner}>
                  <svg width="36" height="36" fill="currentColor" viewBox="0 0 640 512">
                    <path d="M144 0c-8.8 0-16 7.2-16 16V64c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V16c0-8.8-7.2-16-16-16H144zm288 0c-8.8 0-16 7.2-16 16V64c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V16c0-8.8-7.2-16-16-16H432zm-320 96c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16H592c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H112zM48 163.5L58.7 172c11.5 8.7 18.5 22.1 19.3 36.7l.5 8.7c.5 9.7-2.6 19.4-9 27.3L65 250.3c-6.3 8-16.1 12.7-26.4 12.7H32c-11.6 0-22.9-4.1-31.7-11.4L0 251.9V163.5zM48 416v95.5l.3-.3c8.8-7.3 20.1-11.2 31.7-11.2h6.6c10.3 0 20.1 4.7 26.4 12.7l4.7 5.9c6.4 8 9.5 17.6 9 27.3l-.5 8.7c-.7 14.6-7.8 28-19.3 36.7L97 601c-8.8 6.7-19.6 10.2-30.6 10.2H48c-8.8 0-16-7.2-16-16V416c0-8.8 7.2-16 16-16s16 7.2 16 16zM112 192c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16H592c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16H112zm0 80c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16H592c8.8 0 16-7.2 16-16V288c0-8.8-7.2-16-16-16H112zm0 80c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16H592c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16H112zm320 80c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V448c0-8.8-7.2-16-16-16H432zm-288 0c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V448c0-8.8-7.2-16-16-16H144z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className={styles.featureContent}>
              <span className={styles.featureBadge}>Technology</span>
              <h3>Scalable Infrastructure</h3>
              <p>Our platform is built on a flexible, scalable architecture designed to handle growing transaction volumes and expanding user bases while maintaining optimal performance across all integrated networks.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;