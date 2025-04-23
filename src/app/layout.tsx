// src/app/layout.tsx
import { ReactNode } from 'react';
import { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Orbitron, Audiowide } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import ClientLayout from './ClientLayout';

// Font optimization with variable support
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700', '800'],
  fallback: ['system-ui', 'sans-serif'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '700'],
  fallback: ['monospace'],
});

const orbitron = Orbitron({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
  preload: true,
  fallback: ['sans-serif'],
});

const audiowide = Audiowide({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-audiowide',
  display: 'swap',
  preload: true,
  fallback: ['cursive', 'sans-serif'],
});

// Advanced metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://prospera.quantum'),
  title: {
    template: '%s | PROSPERA Neural Quantum Interface',
    default: 'PROSPERA | Advanced Neural Quantum Interface',
  },
  description: "Experience transcendent neural integration with PROSPERA's exclusive quantum interface. 99.9998% synchronization rate. Limited neural connections available.",
  keywords: [
    'quantum neural interface', 
    'neural synchronization', 
    'quantum entanglement', 
    'neural integration', 
    'dimensional matrices', 
    'consciousness expansion', 
    'quantum computation',
    'neural network',
    'digital consciousness',
    'quantum harmonics'
  ],
  creator: 'PROSPERA Quantum Systems',
  publisher: 'PROSPERA Neural Networks',
  authors: [{ name: 'PROSPERA AI', url: 'https://prospera.quantum' }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'PROSPERA Neural Interface',
    title: 'PROSPERA | Advanced Neural Quantum Interface',
    description: "Experience transcendent neural integration with PROSPERA's exclusive quantum interface. 99.9998% synchronization rate. Limited neural connections available.",
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PROSPERA Neural Quantum Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PROSPERA | Advanced Neural Quantum Interface',
    description: "Experience transcendent neural integration with PROSPERA's exclusive quantum interface. 99.9998% synchronization rate. Limited neural connections available.",
    images: ['/images/twitter-image.jpg'],
    creator: '@PROSPERAQuantum',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
  category: 'technology',
}

// Enhanced viewport settings
export const viewport: Viewport = {
  themeColor: '#00ff66',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark',
}

// In layout.tsx
export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="matrix-theme">
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable} ${audiowide.variable}`}>
        <ClientLayout>
          {children}
        </ClientLayout>
        
        <Script id="performance-monitoring" strategy="afterInteractive">
          {`
            // Performance monitoring
            if (typeof window !== 'undefined') {
              try {
                // Create performance observer
                const observer = new PerformanceObserver((list) => {
                  list.getEntries().forEach((entry) => {
                    // Report performance metrics
                    console.log('[Performance]', entry.name, entry.startTime, entry.duration);
                  });
                });
                  
                // Observe key metrics
                observer.observe({ 
                  entryTypes: [
                    'largest-contentful-paint',
                    'first-input',
                    'layout-shift'
                  ] 
                });
              } catch (e) {
                console.warn('Performance monitoring not supported', e);
              }
            }
          `}
        </Script>
      </body>
    </html>
  );
}