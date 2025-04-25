// src/app/layout.tsx
import { Inter } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { LoadingProvider } from '@/context/LoadingContext';
import ClientLayout from './ClientLayout';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://prospera.com'),
  title: {
    default: 'PROSPERA - Neural Interface Technology',
    template: '%s | PROSPERA'
  },
  description: 'Experience the next generation of human-computer interaction with PROSPERA Neural Interface Technology',
  keywords: ['neural interface', 'quantum computing', 'AI', 'technology', 'innovation'],
  authors: [{ name: 'PROSPERA Team' }],
  creator: 'PROSPERA Corporation',
  publisher: 'PROSPERA Corporation',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'PROSPERA - Neural Interface Technology',
    description: 'Experience the next generation of human-computer interaction',
    url: 'https://prospera.com',
    siteName: 'PROSPERA',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PROSPERA - Neural Interface Technology',
    description: 'Experience the next generation of human-computer interaction',
    creator: '@prospera',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#00ff66',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Audiowide&family=JetBrains+Mono:wght@400;500;600;700&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <LoadingProvider>
          <Suspense fallback={
            <div className="fixed inset-0 bg-black flex items-center justify-center">
              <div className="text-green-500">Loading...</div>
            </div>
          }>
            <ClientLayout>{children}</ClientLayout>
          </Suspense>
        </LoadingProvider>
      </body>
    </html>
  );
}