'use client'
import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { beaches, ui, statusLabel } from '@/lib/data'
import { useLang } from '@/lib/LangContext'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

export default function BeachDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const beach = beaches.find(b => b.slug === slug)
  if (!beach) notFound()

  const { lang, t } = useLang()
  const st = statusLabel[beach.status]

  const gradStart = beach.gradient.match(/from-\[([^\]]+)\]/)?.[1] ?? '#0a3d52'
  const gradEnd   = beach.gradient.match(/to-\[([^\]]+)\]/)?.[1]   ?? '#1a9b8a'

  const name    = lang === 'es' ? beach.nameEs    : beach.nameEn
  const tags    = lang === 'es' ? beach.tagsEs    : beach.tagsEn
  const drive   = lang === 'es' ? beach.driveEs   : beach.driveEn
  const desc    = lang === 'es' ? beach.descEs    : beach.descEn
  const tips    = lang === 'es' ? beach.tipsEs    : beach.tipsEn
  const parking = lang === 'es' ? beach.parkingEs : beach.parkingEn
  const bestFor = lang === 'es' ? beach.bestForEs : beach.bestForEn

  const others = beaches.filter(b => b.slug !== slug)

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <TopBar />

      {/* back link */}
      <div className="px-4 py-2.5 flex items-center" style={{ background: 'var(--warm-white)', borderBottom: '1px solid var(--rule)' }}>
        <Link href="/playas" className="flex items-center gap-2 group">
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.1rem', color: 'var(--coral)', letterSpacing: '0.05em' }}>←</span>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--muted)', letterSpacing: '0.12em', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}
            className="group-hover:text-[var(--teal)] transition-colors">
            {lang === 'es' ? 'Todas las Playas' : 'All Beaches'}
          </span>
        </Link>
      </div>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 260, background: `linear-gradient(160deg, ${gradStart}, ${gradEnd})`, borderBottom: '3px solid var(--ink)' }}>
        {/* real photo with gradient fallback */}
        <img
          src={`/images/beaches/${beach.slug}.jpg`}
          alt={name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,20,15,0.1) 0%, rgba(10,20,15,0.65) 100%)' }} />
        <div className="relative z-10 p-5 pt-8 flex flex-col justify-end" style={{ minHeight: 260 }}>
          <div className="mb-3">
            <span className="rounded-sm text-white"
              style={{ fontFamily: "'Barlow Condensed',sans-serif", background: st.color, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px' }}>
              ● {lang === 'es' ? st.es.replace('● ', '') : st.en.replace('● ', '')}
            </span>
          </div>
          <h1 style={{ fontFamily: "'Libre Baskerville',serif", color: '#fff', fontSize: 'clamp(2rem,8vw,2.8rem)', lineHeight: 1.05, textShadow: '0 2px 14px rgba(0,0,0,0.4)', fontWeight: 700 }} className="mb-2">
            {name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', maxWidth: 320, lineHeight: 1.5, textShadow: '0 1px 6px rgba(0,0,0,0.4)', fontStyle: 'italic', fontFamily: "'Libre Baskerville',serif" }}>
            {tags}
          </p>
        </div>
      </div>

      {/* ── QUICK STATS ── */}
      <div className="grid grid-cols-3" style={{ borderBottom: '2px solid var(--ink)' }}>
        {[
          { es: 'Condición', en: 'Condition', val: lang === 'es' ? st.es.replace('● ','') : st.en.replace('● ',''), color: st.color },
          { es: 'Distancia', en: 'Distance',  val: drive, color: 'var(--ink)' },
          { es: 'Mar Hoy',   en: 'Sea Today', val: lang === 'es' ? 'Calmado' : 'Calm', color: 'var(--teal)' },
        ].map((s, i) => (
          <div key={i} className="py-3 px-3" style={{ borderRight: i < 2 ? '1px solid var(--rule)' : 'none' }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--muted)', letterSpacing: '0.14em', fontSize: '0.56rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>
              {lang === 'es' ? s.es : s.en}
            </div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", color: s.color, fontSize: '1.1rem', letterSpacing: '0.03em', lineHeight: 1 }}>
              {s.val}
            </div>
          </div>
        ))}
      </div>

      {/* ── DESCRIPTION ── */}
      <div className="px-4 py-5" style={{ borderBottom: '1px solid var(--rule)' }}>
        <p style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '0.92rem', lineHeight: 1.75, color: 'var(--ink)' }}>
          {desc}
        </p>
      </div>

      {/* ── INSIDER TIPS ── */}
      <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--rule)' }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--muted)', letterSpacing: '0.16em', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>
          💡 {t(ui.insiderTips)}
        </div>
        <div className="space-y-2.5">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--teal)', fontSize: '0.9rem', lineHeight: 1.4, minWidth: 18, flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--ink)', lineHeight: 1.55 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── BEST FOR ── */}
      <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--rule)' }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--muted)', letterSpacing: '0.16em', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>
          {t(ui.bestFor)}
        </div>
        <div className="flex flex-wrap gap-2">
          {bestFor.map(item => (
            <span key={item} className="px-2.5 py-1 rounded-sm text-[0.7rem] font-semibold"
              style={{ background: 'rgba(201,148,58,0.1)', color: 'var(--gold)', border: '1px solid rgba(201,148,58,0.25)' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── PARKING ── */}
      <div className="px-4 py-4" style={{ borderBottom: '2px solid var(--ink)', background: 'rgba(26,122,110,0.04)' }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--muted)', letterSpacing: '0.16em', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
          🅿️ {t(ui.parking)}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--ink)', lineHeight: 1.55 }}>{parking}</p>
      </div>

      {/* ── OTHER BEACHES ── */}
      <div style={{ borderBottom: '2px solid var(--ink)' }}>
        <div className="px-4 pt-3 pb-2.5" style={{ borderBottom: '1px solid var(--rule)' }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--muted)', letterSpacing: '0.2em', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>
            {t(ui.otherBeaches)}
          </span>
        </div>
        <div className="flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {others.map((b, i) => {
            const bGradStart = b.gradient.match(/from-\[([^\]]+)\]/)?.[1] ?? '#0a3d52'
            const bGradEnd   = b.gradient.match(/to-\[([^\]]+)\]/)?.[1]   ?? '#1a9b8a'
            const bSt = statusLabel[b.status]
            return (
              <Link key={b.slug} href={`/playas/${b.slug}`}
                className="flex-shrink-0 min-w-[140px] group"
                style={{ borderRight: i < others.length - 1 ? '1px solid var(--rule)' : 'none' }}>
                <div className="h-20 relative flex items-end p-2 overflow-hidden"
                  style={{ background: `linear-gradient(150deg,${bGradStart},${bGradEnd})` }}>
                  <span className="text-[2.5rem] opacity-20 absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform">{b.emoji}</span>
                  <span className="relative z-10 rounded-sm text-white"
                    style={{ fontFamily: "'Barlow Condensed',sans-serif", background: bSt.color, fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 6px' }}>
                    {lang === 'es' ? bSt.es : bSt.en}
                  </span>
                </div>
                <div className="p-2.5" style={{ background: 'var(--warm-white)' }}>
                  <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {lang === 'es' ? b.nameEs : b.nameEn}
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--teal)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }} className="mt-0.5">
                    {lang === 'es' ? b.driveEs : b.driveEn}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── GET DIRECTIONS ── */}
      <div className="px-4 py-5 mb-20">
        <a href={beach.mapLink} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-sm transition-opacity hover:opacity-90"
          style={{ background: 'var(--ocean)', color: '#fff' }}>
          <span className="text-lg">📍</span>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '0.12em', fontSize: '0.9rem', fontWeight: 700 }}>
            {t(ui.directions)}
          </span>
        </a>
      </div>

      <BottomNav />
    </div>
  )
}
