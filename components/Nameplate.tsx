'use client'
import { useLang } from '@/lib/LangContext'

export default function Nameplate() {
  const { lang } = useLang()
  return (
    <div
      style={{
        background: 'var(--warm-white)',
        borderBottom: '3px solid var(--ink)',
        padding: '12px 16px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <img
        src="/images/logo/PaCaboRojoLogo9.webp"
        alt="Pa' Cabo Rojo — Tu Guía en Tiempo Real"
        style={{
          width: '100%',
          maxWidth: 420,
          height: 'auto',
          display: 'block',
        }}
        translate="no"
      />
    </div>
  )
}
