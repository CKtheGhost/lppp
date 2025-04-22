import type { Metadata } from 'next'
import { Inter, Audiowide, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Font setup with weight variations
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800']
})

const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-audiowide',
  display: 'swap'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '700']
})

export const metadata: Metadata = {
  title: 'PROSPERA | Revolutionary Quantum AI',
  description: "Experience the quantum revolution with PROSPERA's exclusive early access program. 99.9998% success rate. Limited spots available.",
  // Enhanced meta information
  keywords: 'quantum ai, trading platform, early access, cryptocurrency, investment',
  openGraph: {
    title: 'PROSPERA | Revolutionary Quantum AI',
    description: "Experience the quantum revolution with PROSPERA's exclusive early access program. 99.9998% success rate. Limited spots available.",
    images: ['/images/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PROSPERA | Revolutionary Quantum AI',
    description: "Experience the quantum revolution with PROSPERA's exclusive early access program. 99.9998% success rate. Limited spots available.",
    images: ['/images/twitter-image.jpg'],
  },
  themeColor: '#00ff66',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="quantum-theme">
      <body className={`${inter.variable} ${audiowide.variable} ${jetbrainsMono.variable}`}>
        {/* Enhanced loading handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.body.classList.add('loading');
              window.addEventListener('load', function() {
                window.setTimeout(function() {
                  document.body.classList.remove('loading');
                }, 500);
              });
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}