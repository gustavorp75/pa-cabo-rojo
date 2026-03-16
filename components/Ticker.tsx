'use client'
import { useLang } from '@/lib/LangContext'
import { useConditions } from '@/lib/useConditions'

const FALLBACK = {
  es: "⛅ Cargando condiciones... · 🌊 Mar Boquerón · 🌅 Atardecer Los Morrillos      ",
  en: "⛅ Loading conditions... · 🌊 Boquerón waters · 🌅 Sunset at Los Morrillos      ",
}

export default function Ticker() {
  const { lang } = useLang()
  const { data } = useConditions()

  const text = data
    ? (lang === 'es' ? data.ticker.es : data.ticker.en)
    : FALLBACK[lang]

  return (
    <div style={{ background: 'var(--ocean)', borderBottom: '2px solid var(--teal)' }}
      className="overflow-hidden whitespace-nowrap py-1.5">
      <span
        className="ticker-scroll inline-block"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.88)' }}
      >
        {text}
      </span>
    </div>
  )
}
