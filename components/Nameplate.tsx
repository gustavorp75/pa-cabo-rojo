'use client'
import { useLang } from '@/lib/LangContext'

export default function Nameplate() {
  const { lang } = useLang()
  return (
    <div
      className="relative overflow-hidden px-4 pt-5 pb-5 text-center"
      style={{
        background: 'linear-gradient(135deg, var(--ocean) 0%, #1a4a5c 50%, var(--teal) 100%)',
        borderBottom: '3px solid var(--ink)',
      }}
    >
      {/* decorative circles */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10"
        style={{ border: '28px solid var(--teal-light)' }} />
      <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full opacity-10"
        style={{ border: '20px solid var(--gold)' }} />

       {/* title */}
		<span
		  className="relative z-10 block notranslate"
		  translate="no"
		  style={{
			fontFamily: "'Playfair Display', serif",
			fontSize: 'clamp(2.2rem, 10vw, 3.8rem)',
			fontWeight: 900,
			letterSpacing: '-0.01em',
			color: '#ffffff',
			lineHeight: '1',
			textShadow: '0 2px 16px rgba(0,0,0,0.35)',
		  }}
		>
		  PA' CABO <span style={{ color: 'var(--gold)' }}>ROJO</span>
		</span>

      {/* gold rule */}
      <div className="relative z-10 mx-auto my-2.5 w-12 h-px" style={{ background: 'var(--gold)', opacity: 0.7 }} />

      {/* tagline */}
      <p
        className="relative z-10"
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          color: 'rgba(255,255,255,0.65)',
          letterSpacing: '0.2em',
          fontSize: '0.62rem',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}
      >
        {lang === 'es'
          ? "Tu Guía en Tiempo Real · Boquerón y Alrededores"
          : "Your Real-Time Guide · Boquerón & Beyond"}
      </p>
    </div>
  )
}