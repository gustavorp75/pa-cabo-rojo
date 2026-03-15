import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: "Pa' Cabo Rojo — Tu Guía en Tiempo Real",
  description: "La guía local en tiempo real pa' Boquerón y Cabo Rojo.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@600;700&display=swap" rel="stylesheet" />
	  </head>
      <body style={{fontFamily:"'Barlow',sans-serif"}}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
