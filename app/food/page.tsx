'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { fullRestaurants, foodCategoryMeta, type FoodCategory } from '@/lib/data'
import TopBar from '@/components/TopBar'
import Nameplate from '@/components/Nameplate'
import Ticker from '@/components/Ticker'
import BottomNav from '@/components/BottomNav'

function StarRating({ stars }: { stars: number }) {
  return (
    <span style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
      {[1,2,3,4,5].map(i => {
        if (stars >= i) return '★'
        if (stars >= i - 0.5) return '½'
        return '☆'
      }).join('')}
    </span>
  )
}

function PriceBadge({ price }: { price: string }) {
  return (
    <span style={{
      fontFamily: "'Barlow Condensed',sans-serif",
      fontSize: '0.68rem', fontWeight: 700,
      color: price === '$$$' ? 'var(--coral)' : price === '$$' ? 'var(--gold)' : 'var(--teal)',
      letterSpacing: '0.05em',
    }}>
      {price}
    </span>
  )
}

export default function FoodPage() {
  const { lang } = useLang()
  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'all'>('all')
  const [activeStatus, setActiveStatus] = useState<'all' | 'open'>('open')
  const [liveData, setLiveData] = useState<Record<string, any>>({})
  const [statusLoaded, setStatusLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/restaurants')
      .then(r => r.json())
      .then((data: any[]) => {
        const map: Record<string, any> = {}
        data.forEach(r => { map[r.id] = r })
        setLiveData(map)
        setStatusLoaded(true)
      })
      .catch(() => setStatusLoaded(true))
  }, [])

  // Merge live status into static restaurant data
  const restaurants = useMemo(() =>
    fullRestaurants.map(r => {
      const live = liveData[r.id]
      if (!live) return r
      return {
        ...r,
        status: live.status ?? r.status,
        hoursDisplay: live.hoursDisplay ?? '',
        closeTime: live.closeTime ?? null,
        special_offer: live.special_offer ?? (r as any).specialOffer ?? null,
      }
    }),
  [liveData])

  const filtered = useMemo(() => {
    return restaurants.filter(r => {
      const catMatch = activeCategory === 'all' || r.category === activeCategory
      const statusMatch = activeStatus === 'all' || r.status === 'open' || r.status === 'closing-soon'
      return catMatch && statusMatch
    })
  }, [activeCategory, activeStatus, restaurants])

  const openCount = restaurants.filter(r => r.status === 'open' || r.status === 'closing-soon').length

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <TopBar />
      <Nameplate />
      <Ticker />

      {/* ── PAGE HEADER ── */}
      <div style={{ background: 'var(--warm-white)', borderBottom: '3px solid var(--ink)', padding: '18px 18px 16px' }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--teal)', letterSpacing: '0.18em', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
          {lang === 'es' ? 'Dónde Comer y Tomar' : 'Where to Eat & Drink'}
        </div>
        <h1 style={{ fontFamily: "'Libre Baskerville',serif", color: 'var(--ink)', fontSize: 'clamp(1.8rem,7vw,2.4rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: 6 }}>
          {lang === 'es' ? 'Comida & Bares' : 'Food & Bars'}
        </h1>
        {/* open now count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a' }} className="animate-pulse" />
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", color: '#16a34a', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {openCount} {lang === 'es' ? 'abiertos ahora' : 'open right now'}
          </span>
        </div>
      </div>

      {/* ── OPEN NOW TOGGLE ── */}
      <div style={{ background: 'var(--warm-white)', borderBottom: '1px solid var(--rule)', padding: '10px 18px', display: 'flex', gap: 8 }}>
        {[
          { key: 'open', es: 'Abiertos Ahora', en: 'Open Now' },
          { key: 'all',  es: 'Ver Todos',      en: 'See All'  },
        ].map(opt => (
          <button key={opt.key}
            onClick={() => setActiveStatus(opt.key as 'all' | 'open')}
            style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '6px 14px', borderRadius: 2, cursor: 'pointer', transition: 'all 0.15s',
              background: activeStatus === opt.key ? 'var(--ink)' : 'transparent',
              color: activeStatus === opt.key ? '#fff' : 'var(--muted)',
              border: `1px solid ${activeStatus === opt.key ? 'var(--ink)' : 'var(--rule)'}`,
            }}>
            {lang === 'es' ? opt.es : opt.en}
          </button>
        ))}
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div style={{ background: 'var(--warm-white)', borderBottom: '2px solid var(--ink)', overflowX: 'auto', scrollbarWidth: 'none' } as React.CSSProperties}>
        <div style={{ display: 'flex', minWidth: 'max-content' }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '10px 16px', cursor: 'pointer', background: 'transparent', whiteSpace: 'nowrap',
              color: activeCategory === 'all' ? 'var(--ink)' : 'var(--muted)',
              borderRight: '1px solid var(--rule)',
              borderBottom: activeCategory === 'all' ? '3px solid var(--coral)' : '3px solid transparent',
            }}>
            {lang === 'es' ? 'Todo' : 'All'} ({fullRestaurants.length})
          </button>

          {(Object.entries(foodCategoryMeta) as [FoodCategory, typeof foodCategoryMeta[FoodCategory]][]).map(([key, cat]) => {
            const count = fullRestaurants.filter(r => r.category === key).length
            if (count === 0) return null
            const active = activeCategory === key
            return (
              <button key={key}
                onClick={() => setActiveCategory(key)}
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '8px 14px', cursor: 'pointer', background: 'transparent', whiteSpace: 'nowrap',
                  color: active ? 'var(--ink)' : 'var(--muted)',
                  borderRight: '1px solid var(--rule)',
                  borderBottom: active ? '3px solid var(--teal)' : '3px solid transparent',
                  display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'column',
                }}>
                {(cat as any).img
                  ? <img src={(cat as any).img} alt={lang === 'es' ? cat.es : cat.en} style={{ width: 28, height: 28, objectFit: 'contain' }} onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
                  : <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                }
                <span>{lang === 'es' ? cat.es : cat.en}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── RESTAURANT LIST ── */}
      <div style={{ borderBottom: '2px solid var(--ink)' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '40px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>🍽️</div>
            <div style={{ fontFamily: "'Libre Baskerville',serif", color: 'var(--muted)', fontSize: '0.9rem' }}>
              {lang === 'es' ? 'No hay resultados.' : 'No results found.'}
            </div>
          </div>
        ) : (
          filtered.map((r, i) => {
            const cat = foodCategoryMeta[r.category]
            const statusColor = r.status === 'open' ? '#16a34a' : r.status === 'closing-soon' ? '#c9943a' : r.status === 'closed' ? '#e05a3a' : 'var(--muted)'
            const statusText = r.status === 'open'
              ? (lang === 'es' ? 'Abierto' : 'Open')
              : r.status === 'closing-soon'
              ? (lang === 'es' ? `Cierra ${(r as any).closeTime ?? 'pronto'}` : `Closes ${(r as any).closeTime ?? 'soon'}`)
              : r.status === 'closed'
              ? (lang === 'es' ? 'Cerrado' : 'Closed')
              : ''
            const hoursDisplay = (r as any).hoursDisplay ?? ''

            return (
              <div key={r.id}
                style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--rule)' : 'none',
                  background: r.featured ? 'rgba(201,148,58,0.04)' : 'var(--cream)',
                }}>

                {/* sponsored bar */}
                {r.sponsored && (
                  <div style={{ background: 'rgba(201,148,58,0.12)', padding: '4px 18px', borderBottom: '1px solid rgba(201,148,58,0.2)' }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                      ⭐ {lang === 'es' ? 'Destacado' : 'Featured Listing'}
                    </span>
                  </div>
                )}

                <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 12, alignItems: 'start' }}>
                  {/* icon */}
                  <div style={{ width: 52, height: 52, background: 'var(--warm-white)', border: '1px solid var(--rule)', borderRadius: 4, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
                    {(r as any).img
                      ? <img src={(r as any).img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
                      : <span style={{ fontSize: '1.5rem' }}>{r.emoji}</span>
                    }
                  </div>

                  {/* info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>
                        {r.name}
                      </span>
                      <PriceBadge price={r.price} />
                    </div>

                    <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '0.72rem', color: 'var(--muted)', fontStyle: 'italic', marginBottom: 5, lineHeight: 1.4 }}>
                      {lang === 'es' ? r.taglineEs : r.taglineEn}
                    </div>

                    {/* category + location */}
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--teal)' }}>
                        {cat.icon} {lang === 'es' ? cat.es : cat.en}
                      </span>
                      <span style={{ color: 'var(--rule)' }}>·</span>
                      <span style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>
                        📍 {lang === 'es' ? r.locationEs : r.locationEn}
                      </span>
                    </div>

                    {/* must try */}
                    <div style={{ fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink)', fontSize: '0.6rem' }}>
                        {lang === 'es' ? 'Pide: ' : 'Order: '}
                      </span>
                      {lang === 'es' ? r.mustTryEs : r.mustTryEn}
                    </div>
                  </div>

                  {/* right — status + stars + hours */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {statusText && (
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: statusColor, marginBottom: 3 }}>
                        ● {statusText}
                      </div>
                    )}
                    {hoursDisplay && (
                      <div style={{ fontSize: '0.58rem', color: 'var(--muted)', marginBottom: 3 }}>
                        {hoursDisplay}
                      </div>
                    )}
                    <StarRating stars={r.stars} />
                  </div>
                </div>

                {/* directions link */}
                <div style={{ padding: '0 18px 12px', display: 'flex', justifyContent: 'flex-end' }}>
                  <a href={r.mapLink} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', textDecoration: 'none' }}>
                    📍 {lang === 'es' ? 'Cómo llegar →' : 'Get directions →'}
                  </a>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── LIST YOUR RESTAURANT CTA ── */}
      <div style={{ background: 'var(--warm-white)', borderBottom: '2px solid var(--ink)', padding: '20px 18px' }}>
        <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
          {lang === 'es' ? '¿Tienes un restaurante o bar?' : 'Own a restaurant or bar?'}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.55, marginBottom: 14 }}>
          {lang === 'es'
            ? 'Aparece frente a visitantes que deciden dónde comer en este momento. Listado básico gratis — destacado desde $49/mes.'
            : 'Get in front of visitors deciding where to eat right now. Basic listing free — featured from $49/mo.'}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: 'var(--teal)', color: '#fff', padding: '11px 16px', borderRadius: 2, cursor: 'pointer', textAlign: 'center' }}>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {lang === 'es' ? 'Listado Gratis' : 'Free Listing'}
            </span>
          </div>
          <div style={{ flex: 1, background: 'var(--gold)', color: 'var(--ink)', padding: '11px 16px', borderRadius: 2, cursor: 'pointer', textAlign: 'center' }}>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {lang === 'es' ? 'Destacado — $49/mes' : 'Featured — $49/mo'}
            </span>
          </div>
        </div>
      </div>

      <div className="h-24" />
      <BottomNav />
    </div>
  )
}
