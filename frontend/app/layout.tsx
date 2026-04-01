import type { Metadata } from 'next'
import { Bebas_Neue, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// ── Google Fonts (Latin subset only to minimize bundle) ──────────────────
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'BLITZWATCH — Training Reimagined',
    template: '%s | BLITZWATCH',
  },
  description:
    'AI-powered corporate training platform. Watch personalized video episodes and prove your knowledge with interactive quizzes.',
  keywords: ['corporate training', 'e-learning', 'LMS', 'interactive video'],
  robots: { index: false, follow: false }, // Keep internal for now
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
