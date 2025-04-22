import type { Metadata } from 'next'
import { Inter, Audiowide, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Font setup
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
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
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'PROSPERA | Exclusive Early Access',
  description: "Join PROSPERA's exclusive early access program. Experience the future of quantum innovation with 99.9998% success rate.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${audiowide.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  )
}