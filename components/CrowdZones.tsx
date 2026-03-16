'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { useConditions } from '@/lib/useConditions'
import { getAllCrowdScores, zones, type CrowdScore } from '@/lib/crowdScore'

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
    </div>
  )
}

function ZoneCard({ score, lang }: { score: CrowdScore; lang: string }) {
  const zone = zones.find(z => z.id === score.zoneId)!
  const altZone = score.alternativeId ? zones.find(z => z.id === score.alternativeId) : null

  return (
    <Link href={zone.href}
      style={{ textDecoration: 'none', display: 'block', flexShrink: 0, minWidth: 200, maxWidth: 200 }}
      className="group">
      <div style={{
        background: 'var(--ink)',
        border: `1px solid ${score.color}30`,
        borderTop: `3px solid ${score.color}`,
        borderRadius: 6,
        padding: 14,
        height: '100%',
        transition: 'border-color 0.15s',
      }}>
        {/* Zone name + emoji */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <span style={{ fontSize: '1.1rem', marginRight: 6 }}>{zone.emoji}</span>
            <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
              {lang === 'es' ? zone.nameEs : zone.nameEn}
            </span>
          </div>
        </div>

        {/* Crowd level badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: score.color, flexShrink: 0 }} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: score.color, letterSpacing: '0.04em', lineHeight: 1 }}>
            {lang === 'es' ? score.labelEs : score.labelEn}
          </span>
        </div>

        {/* Score bar */}
        <ScoreBar score={score.score} color={score.color} />

        {/* Note */}
        <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.55)', marginTop: 8, lineHeight: 1.5 }}>
          {lang === 'es' ? score.noteEs : score.noteEn}
        </p>

        {/* Confidence + time */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: score.confidence === 'high' ? '#2ba99a' : score.confidence === 'medium' ? '#c9943a' : '#7a9a7a' }}>
            {lang === 'es' ? score.confidenceLabelEs : score.confidenceLabelEn}
          </span>
          {score.updatedMinsAgo > 0 && (
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.56rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>
              {lang === 'es' ? `Hace ${score.updatedMinsAgo}min` : `${score.updatedMinsAgo}min ago`}
            </span>
          )}
        </div>

        {/* Alternative suggestion */}
        {altZone && (
          <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2ba99a' }}>
              {lang === 'es' ? `→ Prueba ${altZone.nameEs}` : `→ Try ${altZone.nameEn}`}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default function CrowdZones() {
  const { lang } = useLang()
  const { data: wx } = useConditions()
  const [eventOverrides, setEventOverrides] = useState<Record<string, any>>({})

  useEffect(() => {
    // Load event overrides from settings (no auth needed for reading event impacts)
    fetch('/api/conditions')
      .then(() => {}) // already have weather
      .catch(() => {})
    // Try to get event settings — won't work without auth but that's ok
    // event overrides are optional enhancement
  }, [])

  const scores = getAllCrowdScores(wx ?? null, eventOverrides)

  // Sort: busy first so most actionable info is visible
  const sorted = [...scores].sort((a, b) => b.score - a.score)

  return (
    <div style={{ borderBottom: '2px solid var(--ink)' }}>
      {/* Section header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 18px 9px', borderBottom: '1px solid var(--rule)' }}>
        <div>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {lang === 'es' ? '¿Qué tan lleno está?' : 'How Crowded Is It?'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2ba99a' }} className="animate-pulse" />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2ba99a' }}>
            {lang === 'es' ? 'En Tiempo Real' : 'Live'}
          </span>
        </div>
      </div>

      {/* Horizontal scroll of zone cards */}
      <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '14px 18px 16px', display: 'flex', gap: 10 }}
        className="no-scrollbar">
        {sorted.map(score => (
          <ZoneCard key={score.zoneId} score={score} lang={lang} />
        ))}
      </div>

      {/* Legend */}
      <div style={{ padding: '0 18px 12px', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[
          { level: 'calm',      es: 'Tranquilo',  en: 'Calm',      color: '#16a34a' },
          { level: 'moderate',  es: 'Moderado',   en: 'Moderate',  color: '#2ba99a' },
          { level: 'busy',      es: 'Concurrido', en: 'Busy',      color: '#c9943a' },
          { level: 'very-busy', es: 'Muy Lleno',  en: 'Very Busy', color: '#e05a3a' },
        ].map(l => (
          <div key={l.level} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              {lang === 'es' ? l.es : l.en}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
