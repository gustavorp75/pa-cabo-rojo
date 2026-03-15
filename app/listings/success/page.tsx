'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { useLang } from '@/lib/LangContext'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

function SuccessContent() {
  const { lang } = useLang()
  const params = useSearchParams()
  const plan = params.get('plan') ?? 'free'
  const isFeatured = plan === 'featured' || params.get('session_id')

  return (
    <div style={{ padding: '40px 18px', textAlign: 'center' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>
        {isFeatured ? '🎉' : '✅'}
      </div>

      <h1 style={{ fontFamily: "'Libre Baskerville', serif", color: 'var(--ink)', fontSize: '1.6rem', fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>
        {isFeatured
          ? (lang === 'es' ? '¡Tu listado está activo!' : 'Your listing is live!')
          : (lang === 'es' ? '¡Recibimos tu listado!' : 'We got your listing!')}
      </h1>

      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto 24px' }}>
        {isFeatured
          ? (lang === 'es'
              ? 'Tu negocio ya aparece destacado en Pa\' Cabo Rojo. Los visitantes lo verán al tomar decisiones en tiempo real.'
              : 'Your business is now featured on Pa\' Cabo Rojo. Visitors will see it when making real-time decisions.')
          : (lang === 'es'
              ? 'Revisaremos tu listado en las próximas 24 horas y te notificaremos por email cuando esté activo.'
              : 'We\'ll review your listing within 24 hours and notify you by email when it\'s active.')}
      </p>

      {isFeatured && (
        <div style={{ background: 'rgba(26,122,110,0.08)', border: '1px solid rgba(26,122,110,0.2)', borderRadius: 4, padding: '14px 16px', marginBottom: 24, textAlign: 'left', maxWidth: 340, margin: '0 auto 24px' }}>
          {[
            [lang === 'es' ? '⭐ Primero en tu categoría' : '⭐ Top of your category', ''],
            [lang === 'es' ? '🌙 En la sección Esta Noche' : '🌙 In the Tonight section', ''],
            [lang === 'es' ? '📍 Badge en el mapa' : '📍 Badge on the map', ''],
            [lang === 'es' ? '📧 Factura enviada por email' : '📧 Receipt sent by email', ''],
          ].map(([item], i) => (
            <div key={i} style={{ fontSize: '0.78rem', color: 'var(--teal)', marginBottom: 6 }}>{item}</div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300, margin: '0 auto' }}>
        <Link href="/"
          style={{ padding: '13px', background: 'var(--ocean)', color: '#fff', borderRadius: 3, textDecoration: 'none', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
          {lang === 'es' ? '← Volver al inicio' : '← Back to home'}
        </Link>
        <Link href="/food"
          style={{ padding: '13px', background: 'transparent', color: 'var(--teal)', border: '1px solid var(--teal)', borderRadius: 3, textDecoration: 'none', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
          {lang === 'es' ? 'Ver listados de comida' : 'View food listings'}
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  const { lang } = useLang()
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <TopBar />
      <div style={{ background: 'var(--warm-white)', borderBottom: '3px solid var(--ink)', padding: '14px 18px' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--ink)', fontSize: '1.4rem', letterSpacing: '0.04em' }}>
          PA' CABO ROJO
        </h2>
      </div>
      <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>...</div>}>
        <SuccessContent />
      </Suspense>
      <div className="h-24" />
      <BottomNav />
    </div>
  )
}
