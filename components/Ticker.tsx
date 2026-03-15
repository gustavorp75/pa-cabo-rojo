'use client'
import { useLang } from '@/lib/LangContext'

export default function Ticker() {
  const { lang } = useLang()
  const text = {
    es: "☀️ 84°F / 29°C — Parcialmente Soleado · 💨 Vientos 12 mph Este — Algo de oleaje en Combate · 🌊 Mar Calmado — Ideal para bucear en Playa Sucia · 🌅 Atardecer 6:48 PM — Ve a Los Morrillos antes de las 6:15 · 🅿️ Estacionamiento disponible en Buyé · 🎶 Salsa en vivo esta noche en Shamar — Sin cargo      ",
    en: "☀️ 84°F / 29°C — Partly Sunny · 💨 Winds 12 mph East — Some chop at Combate · 🌊 Calm Surf — Perfect snorkel day at Playa Sucia · 🌅 Sunset 6:48 PM — Head to Los Morrillos by 6:15 · 🅿️ Parking available at Buyé · 🎶 Live salsa tonight at Shamar — No cover      "
  }
  return (
    <div style={{ background: 'var(--ocean)', borderBottom: '2px solid var(--teal)' }} className="overflow-hidden whitespace-nowrap py-1.5">
      <span className="ticker-scroll inline-block"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.88)' }}>
        {text[lang]}
      </span>
    </div>
  )
}
