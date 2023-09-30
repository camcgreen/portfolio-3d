import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cam Green - Interactive Designer & Developer',
  description: 'Interactive Designer & Developer based in Manchester, UK',
  keywords:
    'Developer, creative, professional, development, web, design, nextjs, react, figma, gsap, typescript, javascript, html, css, interactive, interaction, freelance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
