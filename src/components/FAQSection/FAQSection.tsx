'use client'

import { useState } from 'react';
import styles from './FAQSection.module.css';

interface FAQSectionProps {
  inView: boolean;
}

const FAQSection = ({ inView }: FAQSectionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is PROSPERA's early access program?",
      answer: "PROSPERA's early access program is an exclusive opportunity for selected applicants to experience our revolutionary AI-powered investment platform before its public release. Participants will gain priority access to our Omnimind_Nexus AI system with its 99.9998% success rate, cross-chain infrastructure, and institutional-grade trading strategies. Early access members also receive special benefits including priority support, exclusive rewards, and the opportunity to provide feedback that will shape the platform's development."
    },
    {
      question: "How are early access participants selected?",
      answer: "We carefully review all early access applications to create a diverse community of users who can provide valuable feedback. While investment experience is considered, we also select participants based on their technical background, industry expertise, and potential to contribute meaningfully to our platform's development. Our selection process ensures a balanced group of beginners, intermediate users, and advanced traders to help us optimize PROSPERA for all user skill levels. Applications are processed on a rolling basis, with priority given to early applicants."
    },
    {
      question: "Is there a cost to join the early access program?",
      answer: "There is no fee to participate in PROSPERA's early access program. Selected participants receive complimentary access to our platform during the development phase. While no initial investment is required to join, users who wish to utilize all trading functions will need to deposit funds into their PROSPERA wallet. Early access members also receive exclusive benefits including fee waivers, special staking allocations, and priority token pricing that won't be available after the public launch."
    },
    {
      question: "What is the Omnimind_Nexus AI system?",
      answer: "Omnimind_Nexus is our proprietary AI system that combines deep learning, predictive analytics, and real-time market analysis to achieve an unprecedented 99.9998% success rate in trading strategies. The system processes vast amounts of market data, identifies optimal trading opportunities, and executes trades with exceptional accuracy. By removing human emotion from the trading process, Omnimind_Nexus delivers consistent performance across various market conditions, providing institutional-grade investment strategies previously available only to elite clientele."
    },
    {
      question: "What blockchain networks does PROSPERA support?",
      answer: "PROSPERA features a comprehensive cross-chain infrastructure with omni-chain capabilities enabled through our partnership with Via Labs. Our platform seamlessly integrates with multiple blockchain networks, providing unified access and liquidity across the decentralized ecosystem. During the early access phase, we will gradually enable support for major networks including Ethereum, Solana, Binance Smart Chain, Polygon, and others. This multi-chain approach ensures that users can leverage our AI trading strategies across their preferred networks while maintaining optimized performance."
    },
    {
      question: "How do I provide feedback during early access?",
      answer: "Early access participants have multiple channels to provide feedback and influence PROSPERA's development. The platform includes an integrated feedback module for real-time suggestions and bug reports. We also conduct weekly focus groups and one-on-one interviews with selected participants. Our team actively monitors user behavior and platform metrics to identify areas for improvement. Additionally, early access members receive invitations to exclusive webinars and AMAs with our development team. Your insights directly impact our development roadmap and feature prioritization."
    }
  ];

  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>Get answers to common questions about our early access program and PROSPERA platform.</p>
        </div>
        
        <div className={styles.faqList} aria-label="Frequently Asked Questions">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''} ${inView ? styles.animate : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className={styles.faqQuestion} 
                onClick={() => toggleFAQ(index)}
                tabIndex={0}
                role="button"
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFAQ(index);
                  }
                }}
              >
                <div className={styles.faqIcon} aria-hidden="true">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                  </svg>
                </div>
                <div className={styles.faqQuestionText}>{item.question}</div>
                <div className={styles.faqToggle} aria-hidden="true">
                  <svg className={styles.plus} width="14" height="14" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                  </svg>
                  <svg className={styles.minus} width="14" height="14" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/>
                  </svg>
                </div>
              </div>
              <div 
                className={styles.faqAnswer} 
                id={`faq-answer-${index}`}
                style={{ 
                  maxHeight: activeIndex === index ? '1000px' : '0',
                  opacity: activeIndex === index ? 1 : 0
                }}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.backgroundEffects} aria-hidden="true">
        <div className={styles.glowOrb}></div>
      </div>
    </section>
  );
};

export default FAQSection;