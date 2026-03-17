'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { fullEvents, categoryMeta, type EventCategory } from '@/lib/data'
import TopBar from '@/components/TopBar'
import Nameplate from '@/components/Nameplate'
import Ticker from '@/components/Ticker'
import BottomNav from '@/components/BottomNav'

const timeOrder = (ev: { time: string; ampm: string }) => {
  const [h, m] = ev.time.split(':').map(Number)
  const hour = ev.ampm === 'pm' && h !== 12 ? h + 12 : ev.ampm === 'am' && h === 12 ? 0 : h
  return hour * 60 + m
}

export default function TonightPage() {
  const { lang, t } = useLang()
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'all'>('all')

  const now = new Date()
  const days   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
  const daysEN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const months   = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  const monthsEN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const dateStr = lang === 'es'
    ? `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]}`
    : `${daysEN[now.getDay()]}, ${monthsEN[now.getMonth()]} ${now.getDate()}`

  const filtered = useMemo(() => {
    const list = activeCategory === 'all'
      ? fullEvents
      : fullEvents.filter(e => e.category === activeCategory)
    return [...list].sort((a, b) => timeOrder(a) - timeOrder(b))
  }, [activeCategory])

  // group by time of day
  const morning   = filtered.filter(e => timeOrder(e) < 12 * 60)
  const afternoon = filtered.filter(e => timeOrder(e) >= 12 * 60 && timeOrder(e) < 18 * 60)
  const evening   = filtered.filter(e => timeOrder(e) >= 18 * 60)

  const typeStyle = (type: string) => {
    if (type === 'featured') return { background: 'var(--gold)', color: 'var(--ink)', border: 'none' }
    if (type === 'sponsored') return { background: 'var(--coral)', color: '#fff', border: 'none' }
    return { background: 'transparent', color: 'var(--teal-light)', border: '1px solid rgba(26,122,110,0.6)' }
  }

  const EventCard = ({ ev }: { ev: typeof fullEvents[0] }) => {
    const cat = categoryMeta[ev.category]
    return (
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="grid" style={{ gridTemplateColumns: '58px 1fr auto', alignItems: 'stretch' }}>
          {/* time */}
          <div style={{ padding: '14px 0 14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.1rem', color: 'var(--gold)', letterSpacing: '0.05em', lineHeight: 1 }}>
              {ev.time}
            </span>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.52rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
              {ev.ampm}
            </span>
          </div>

          {/* body */}
          <div style={{ padding: '14px 12px', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
            {/* category tag */}
            <div className="flex items-center gap-1.5 mb-1.5">
              {(cat as any).img
                ? <img src={(cat as any).img} alt="" style={{ width: 18, height: 18, objectFit: 'contain', display: 'inline-block' }} onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
                : <span className="text-[0.7rem]">{cat.icon}</span>
              }
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: cat.color }}>
                {lang === 'es' ? cat.es : cat.en}
              </span>
              {(ev.recurs || ev.recursEn) && (
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.56rem', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
                  · {lang === 'es' ? ev.recurs : ev.recursEn}
                </span>
              )}
            </div>

            <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: 3, lineHeight: 1.25 }}>
              {lang === 'es' ? ev.nameEs : ev.nameEn}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
              📍 {lang === 'es' ? ev.whereEs : ev.whereEn}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.55 }}>
              {lang === 'es' ? ev.descEs : ev.descEn}
            </div>
          </div>

          {/* pill */}
          <div style={{ padding: '14px 14px 14px 0', display: 'flex', alignItems: 'flex-start', paddingTop: 16 }}>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: 2, ...typeStyle(ev.type) }}>
              {lang === 'es' ? ev.labelEs : ev.labelEn}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const TimeGroup = ({ labelEs, labelEn, icon, events }: { labelEs: string; labelEn: string; icon: string; events: typeof fullEvents }) => {
    if (events.length === 0) return null
    return (
      <div>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="text-sm">{icon}</span>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
            {lang === 'es' ? labelEs : labelEn}
          </span>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.2)', marginLeft: 4 }}>
            {events.length}
          </span>
        </div>
        {events.map(ev => <EventCard key={ev.id} ev={ev} />)}
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <TopBar />
      <Nameplate />
      <Ticker />

      {/* ── PAGE HEADER ── */}
      <div style={{ background: 'var(--ink)', borderBottom: '3px solid var(--ink)', padding: '20px 18px 16px' }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--teal-light)', letterSpacing: '0.18em', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
          {lang === 'es' ? 'Agenda del Día' : "Today's Calendar"}
        </div>
        <h1 style={{ fontFamily: "'Libre Baskerville',serif", color: '#fff', fontSize: 'clamp(1.8rem,7vw,2.4rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: 6 }}>
          {lang === 'es' ? 'Esta Noche' : 'Tonight'}
        </h1>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {dateStr} · Boquerón, PR
        </div>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div style={{ background: 'var(--ink)', borderBottom: '2px solid var(--teal)', overflowX: 'auto', scrollbarWidth: 'none' } as React.CSSProperties}>
        <div className="flex" style={{ minWidth: 'max-content', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {/* ALL tab */}
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '10px 16px',
              color: activeCategory === 'all' ? '#fff' : 'rgba(255,255,255,0.35)',
              borderBottom: activeCategory === 'all' ? '3px solid var(--coral)' : '3px solid transparent',
              borderRight: '1px solid rgba(255,255,255,0.07)',
              background: 'transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>
            {lang === 'es' ? 'Todo' : 'All'} ({fullEvents.length})
          </button>

          {(Object.entries(categoryMeta) as [EventCategory, typeof categoryMeta[EventCategory]][]).map(([key, cat]) => {
            const count = fullEvents.filter(e => e.category === key).length
            if (count === 0) return null
            const active = activeCategory === key
            return (
              <button key={key}
                onClick={() => setActiveCategory(key)}
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '10px 14px',
                  color: active ? '#fff' : 'rgba(255,255,255,0.35)',
                  borderBottom: active ? `3px solid ${cat.color}` : '3px solid transparent',
                  borderRight: '1px solid rgba(255,255,255,0.07)',
                  background: 'transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                {(cat as any).img
                  ? <img src={(cat as any).img} alt={lang === 'es' ? cat.es : cat.en} style={{ width: 24, height: 24, objectFit: 'contain' }} onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
                  : <span>{cat.icon}</span>
                }
                <span>{lang === 'es' ? cat.es : cat.en}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── EVENT LIST ── */}
      <div style={{ background: 'var(--ink)', color: '#fff', borderBottom: '2px solid var(--ink)' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '40px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>🌴</div>
            <div style={{ fontFamily: "'Libre Baskerville',serif", color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
              {lang === 'es' ? 'No hay eventos en esta categoría hoy.' : 'No events in this category today.'}
            </div>
          </div>
        ) : (
          <>
            <TimeGroup labelEs="Mañana" labelEn="Morning" icon="🌅" events={morning} />
            <TimeGroup labelEs="Tarde" labelEn="Afternoon" icon="☀️" events={afternoon} />
            <TimeGroup labelEs="Noche" labelEn="Evening" icon="🌙" events={evening} />
          </>
        )}
      </div>

      {/* ── SUBMIT EVENT CTA ── */}
      <div style={{ background: 'var(--warm-white)', borderBottom: '2px solid var(--ink)', padding: '20px 18px' }}>
        <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
          {lang === 'es' ? '¿Tienes un evento?' : 'Have an event?'}
        </div>
        <div style={{ fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.55, marginBottom: 14 }}>
          {lang === 'es'
            ? 'Promociona tu evento a visitantes y locales que deciden qué hacer esta noche.'
            : 'Promote your event to visitors and locals deciding what to do tonight.'}
        </div>
        <div className="flex gap-3">
          <div style={{ flex: 1, background: 'var(--teal)', color: '#fff', padding: '11px 16px', borderRadius: 2, cursor: 'pointer', textAlign: 'center' }}>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {lang === 'es' ? 'Enviar Evento — $25' : 'Submit Event — $25'}
            </span>
          </div>
          <div style={{ flex: 1, background: 'transparent', color: 'var(--teal)', padding: '11px 16px', borderRadius: 2, cursor: 'pointer', textAlign: 'center', border: '1px solid var(--teal)' }}>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {lang === 'es' ? 'Evento Gratis' : 'Free Listing'}
            </span>
          </div>
        </div>
      </div>

      {/* ── BACK TO HOME ── */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--rule)' }}>
        <Link href="/" className="flex items-center gap-2 group">
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.1rem', color: 'var(--coral)' }}>←</span>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--muted)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}
            className="group-hover:text-[var(--teal)] transition-colors">
            {lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}
          </span>
        </Link>
      </div>

      <div className="h-24" />
      <BottomNav />
    </div>
  )
}
