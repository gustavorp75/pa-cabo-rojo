'use client'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { beaches, attractions, events, restaurants, plans, ui, statusLabel } from '@/lib/data'
import TopBar from '@/components/TopBar'
import { useConditions } from '@/lib/useConditions'
import { getBeachConditions } from '@/lib/beachConditions'
import CrowdZones from '@/components/CrowdZones'
import Nameplate from '@/components/Nameplate'
import Ticker from '@/components/Ticker'
import BottomNav from '@/components/BottomNav'

export default function Home() {
  const { lang, t } = useLang()
  const { data: wx } = useConditions()
  const beachConds = getBeachConditions(wx ?? null)

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <TopBar />
      <Nameplate />
      <Ticker />

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 260, background: 'linear-gradient(160deg,#0a3d52,#1a9b8a)', borderBottom: '3px solid var(--ink)' }}>
        {/* hero photo */}
        <img
          src="/images/hero/hero-main2.webp"
          alt="Boquerón beach aerial view"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        {/* dark overlay so text pops */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,20,15,0.3) 0%, rgba(10,20,15,0.7) 100%)' }} />
        {/* photo credit */}
        <div style={{ position: 'absolute', top: 8, right: 10, zIndex: 3, fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.52rem', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.25)', padding: '2px 6px', borderRadius: 2 }}>
          © Cristian Escobar / Unsplash
        </div>
        <div className="relative z-10 p-5 pt-8 flex flex-col justify-end" style={{ minHeight: 260 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--teal-light)', letterSpacing: '0.2em' }} className="text-[0.65rem] font-bold uppercase mb-2">
            {wx ? `${wx.weather.emoji} ${lang === 'es' ? wx.weather.descEs : wx.weather.descEn} · ${wx.temp.f}°F` : (lang === 'es' ? 'Recomendación del Día' : "Today's Top Pick")}
          </div>
          <h1 style={{ fontFamily: "'Libre Baskerville',serif", color: '#fff', fontSize: 'clamp(1.8rem,7vw,2.5rem)', lineHeight: 1.08, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }} className="font-bold mb-2">
            {lang === 'es'
              ? <span>Olvida el Balneario.<br />Ve a <em style={{ color: 'var(--gold)' }}>Playa Sucia.</em></span>
              : <span>Skip Balneario.<br />Go to <em style={{ color: 'var(--gold)' }}>Playa Sucia.</em></span>}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.82rem', maxWidth: 300, lineHeight: 1.55, textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
            {lang === 'es'
              ? 'Agua tranquila, sin multitudes y el faro de fondo. Vale la pena el camino de tierra.'
              : 'Calm water, zero crowds, lighthouse behind you. Dirt road is worth it.'}
          </p>
        </div>
      </div>

      {/* ── CONDITIONS ── */}
      <div className="grid grid-cols-4" style={{ borderBottom: '2px solid var(--ink)' }}>
        {[
          {
            es: 'Temp', en: 'Temp',
            val: wx ? `${wx.temp.f}°F` : '—',
            note: wx ? (lang === 'es' ? `Se siente ${wx.feelsLike.f}°` : `Feels ${wx.feelsLike.f}°`) : '',
          },
          {
            es: 'Viento', en: 'Wind',
            val: wx ? `${wx.wind.mph}mph` : '—',
            note: wx ? `${wx.wind.compass} · ${lang === 'es' ? wx.wind.conditionEs : wx.wind.conditionEn}` : '',
          },
          {
            es: 'Mar', en: 'Sea',
            val: wx ? (lang === 'es' ? wx.waves.conditionEs : wx.waves.conditionEn) : '—',
            note: wx ? `${wx.waves.ft}ft` : '',
          },
          {
            es: 'Ocaso', en: 'Sunset',
            val: wx ? wx.sunset.replace(' PM','').replace(' AM','') : '—',
            note: wx ? wx.sunset.includes('PM') ? 'PM' : 'AM' : '',
          },
        ].map((c, i) => (
          <div key={i} className="py-3 px-2 text-center" style={{ borderRight: i < 3 ? '1px solid var(--rule)' : 'none' }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--muted)', letterSpacing: '0.12em' }} className="text-[0.52rem] font-bold uppercase mb-1">
              {lang === 'es' ? c.es : c.en}
            </div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--ink)', fontSize: '1.3rem', letterSpacing: '0.03em', lineHeight: 1 }}>
              {c.val}
            </div>
            {c.note && <div style={{ fontSize: '0.55rem', color: 'var(--teal)', marginTop: 1 }}>{c.note}</div>}
          </div>
        ))}
      </div>

      {/* ── CROWD ZONES ── */}
      <CrowdZones />

      {/* ── MODE TABS ── */}
      <div className="overflow-x-auto" style={{ borderBottom: '2px solid var(--ink)', background: 'var(--warm-white)', scrollbarWidth: 'none' }}>
        <div className="flex min-w-max">
          {[ui.tabBeaches, ui.tabFamily, ui.tabSunset, ui.tabFood, ui.tabNight, ui.tabCouple].map((tab, i) => (
            <div key={i}
              className="px-4 py-2.5 cursor-pointer"
              style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: i === 0 ? 'var(--ink)' : 'var(--muted)', borderRight: '1px solid var(--rule)', borderBottom: i === 0 ? '3px solid var(--coral)' : '3px solid transparent', whiteSpace: 'nowrap' }}>
              {t(tab)}
            </div>
          ))}
        </div>
      </div>

      {/* ── BEACHES ── */}
      <div className="flex justify-between items-center px-4 pt-3 pb-2.5" style={{ borderBottom: '1px solid var(--rule)' }}>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--muted)', letterSpacing: '0.2em' }} className="text-[0.6rem] font-bold uppercase">
          {t(ui.bestBeaches)}
        </span>
        <Link href="/playas" style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--teal)', letterSpacing: '0.1em' }} className="text-[0.68rem] font-bold uppercase">
          {t(ui.seeAll)}
        </Link>
      </div>

      <div className="grid grid-cols-2" style={{ borderBottom: '2px solid var(--ink)' }}>
        {beaches.map((b, i) => {
          const cond = beachConds[b.slug]
          const st = cond
            ? { es: cond.labelEs, en: cond.labelEn, color: cond.color }
            : { es: '● Excelente', en: '● Great', color: '#16a34a' }
          return (
            <Link key={b.slug} href={`/playas/${b.slug}`}
              className="block overflow-hidden group"
              style={{ borderRight: i % 2 === 0 ? '1px solid var(--rule)' : 'none', borderBottom: i < 2 ? '1px solid var(--rule)' : 'none' }}>
              <div className={`h-20 relative overflow-hidden bg-gradient-to-br ${b.gradient}`}>
                <img src={`/images/beaches/${b.slug}.webp`} alt={lang==='es'?b.nameEs:b.nameEn} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.45) 100%)' }} />
                <span className="absolute bottom-2 left-2 z-10 rounded-sm text-white"
                  style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 7px', background: st.color }}>
                  {lang === 'es' ? st.es : st.en}
                </span>
              </div>
              <div className="p-2.5 group-hover:bg-[rgba(26,122,110,0.04)] transition-colors">
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)' }}>
                  {lang === 'es' ? b.nameEs : b.nameEn}
                </div>
                <div style={{ fontSize: '0.63rem', color: 'var(--muted)' }} className="mt-0.5">
                  {lang === 'es' ? b.tagsEs : b.tagsEn}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--teal)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }} className="mt-1">
                  {lang === 'es' ? b.driveEs : b.driveEn}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── ATTRACTIONS ── */}
      <div className="flex justify-between items-center px-4 pt-3 pb-2.5" style={{ borderBottom: '1px solid var(--rule)' }}>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--muted)', letterSpacing: '0.2em' }} className="text-[0.6rem] font-bold uppercase">
          {t(ui.attractions)}
        </span>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--teal)', letterSpacing: '0.1em' }} className="text-[0.68rem] font-bold uppercase cursor-pointer">
          {t(ui.explore)}
        </span>
      </div>

      <div className="flex overflow-x-auto" style={{ borderBottom: '2px solid var(--ink)', scrollbarWidth: 'none' }}>
        {attractions.map((a, i) => (
          <div key={a.slug} className="flex-shrink-0 min-w-[140px] cursor-pointer group"
            style={{ borderRight: i < attractions.length - 1 ? '1px solid var(--rule)' : 'none' }}>
            <div className={`h-[90px] relative overflow-hidden`} style={{background:`linear-gradient(135deg,${a.gradient.match(/from-\[([^\]]+)\]/)?.[1]??'#0d2d3f'},${a.gradient.match(/to-\[([^\]]+)\]/)?.[1]??'#1a7a6e'})`}}>
              <img
                src={`/images/attractions/${a.slug}.webp`}
                alt={lang==='es'?a.nameEs:a.nameEn}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}}
              />
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.4) 100%)'}}/>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.4) 100%)' }} />
            </div>
            <div className="p-2.5" style={{ background: 'var(--warm-white)' }}>
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>
                {lang === 'es' ? a.nameEs : a.nameEn}
              </div>
              <div style={{ fontSize: '0.64rem', color: 'var(--muted)' }} className="mt-0.5">
                {lang === 'es' ? a.subEs : a.subEn}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TONIGHT ── */}
      <div style={{ background: 'var(--ink)', color: '#fff', borderBottom: '2px solid var(--ink)' }}>
        <div className="flex justify-between items-baseline px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.8rem', letterSpacing: '0.06em' }}>{t(ui.tonight)}</span>
          <Link href="/tonight" style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--teal-light)', letterSpacing: '0.1em' }} className="text-[0.68rem] font-bold uppercase">
            {lang === 'es' ? 'Ver todo →' : 'Full calendar →'}
          </Link>
        </div>
        {events.map((ev, i) => (
          <div key={i} className="grid" style={{ gridTemplateColumns: '54px 1fr auto', borderBottom: '1px solid rgba(255,255,255,0.07)', alignItems: 'stretch' }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1rem', color: 'var(--gold)', padding: '12px 0 12px 16px', lineHeight: 1.1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {ev.time}
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>{ev.ampm}</span>
            </div>
            <div style={{ padding: '12px', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '0.85rem', fontWeight: 700, marginBottom: 2 }}>{lang === 'es' ? ev.nameEs : ev.nameEn}</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.42)' }}>{lang === 'es' ? ev.whereEs : ev.whereEn}</div>
            </div>
            <div style={{ padding: '12px 14px 12px 0', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: 2, background: ev.type === 'featured' ? 'var(--gold)' : 'transparent', color: ev.type === 'featured' ? 'var(--ink)' : 'var(--teal-light)', border: ev.type === 'free' ? '1px solid rgba(26,122,110,0.6)' : 'none' }}>
                {lang === 'es' ? ev.labelEs : ev.labelEn}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── FOOD ── */}
      <div style={{ borderBottom: '2px solid var(--ink)' }}>
        <div className="flex justify-between items-center px-4 pt-3 pb-2.5" style={{ borderBottom: '1px solid var(--rule)' }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--muted)', letterSpacing: '0.2em' }} className="text-[0.6rem] font-bold uppercase">{t(ui.openNow)}</span>
          <Link href="/food" style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--teal)', letterSpacing: '0.1em' }} className="text-[0.68rem] font-bold uppercase">{t(ui.fullList)}</Link>
        </div>
        {restaurants.map((r, i) => (
          <div key={i} className="flex gap-3 items-center px-0 py-0 cursor-pointer group"
            style={{ borderBottom: i < restaurants.length - 1 ? '1px solid var(--rule)' : 'none', background: r.highlight ? 'rgba(201,148,58,0.04)' : 'transparent', paddingLeft: 18, paddingRight: 18, paddingTop: 13, paddingBottom: 13 }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.9rem', color: r.highlight ? 'var(--gold)' : 'var(--rule)', lineHeight: 1, minWidth: 36, textAlign: 'right' }}>{r.num}</div>
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '0.88rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>{r.name}</div>
              <div style={{ fontSize: '0.67rem', color: 'var(--muted)', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <span>{lang === 'es' ? r.typeEs : r.typeEn}</span><span>·</span><span>{r.price}</span>
                {(lang === 'es' ? r.noteEs : r.noteEn) && <><span>·</span><span>{lang === 'es' ? r.noteEs : r.noteEn}</span></>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: r.status === 'open' ? '#16a34a' : 'var(--coral)' }}>
                {lang === 'es' ? r.statusEs : r.statusEn}
              </div>
              <div style={{ fontSize: '0.64rem', color: 'var(--gold)', marginTop: 2 }}>{r.stars}</div>
              {r.sponsored && <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.52rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 1 }}>{lang === 'es' ? 'Patrocinado' : 'Sponsored'}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* ── PLANS ── */}
      <div style={{ borderBottom: '2px solid var(--ink)' }}>
        <div className="px-4 pt-3 pb-2.5" style={{ borderBottom: '1px solid var(--rule)' }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--muted)', letterSpacing: '0.2em' }} className="text-[0.6rem] font-bold uppercase">{t(ui.quickPlans)}</span>
        </div>
        <div className="flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {plans.map((p, i) => (
            <div key={i} className="flex-shrink-0 min-w-[148px] p-4 cursor-pointer hover:bg-[rgba(26,122,110,0.05)] transition-colors"
              style={{ borderRight: i < plans.length - 1 ? '1px solid var(--rule)' : 'none' }}>
              <div className="w-6 h-0.5 mb-2.5 rounded-sm" style={{ background: p.color }} />
              <div className="mb-2" style={{ height: 36 }}>
                {(p as any).img
                  ? <img src={(p as any).img} alt={lang==='es'?p.nameEs:p.nameEn} style={{ width: 36, height: 36, objectFit: 'contain' }} onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
                  : <span className="text-xl">{p.icon}</span>
                }
              </div>
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '0.86rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 4, lineHeight: 1.2 }}>
                {lang === 'es' ? p.nameEs : p.nameEn}
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                {lang === 'es' ? p.descEs : p.descEn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BIZ CTA ── */}
      <Link href="/listings/new" className="grid hover:bg-[var(--sand)] transition-colors px-4 py-5 gap-4"
        style={{ gridTemplateColumns: '1fr auto', borderBottom: '2px solid var(--ink)', background: 'var(--warm-white)', textDecoration: 'none' }}>
        <div>
          <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: '0.98rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 3, lineHeight: 1.25 }}>{t(ui.bizHed)}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.5 }}>{t(ui.bizSub)}</div>
        </div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2.2rem', color: 'var(--coral)', lineHeight: 1 }}>→</div>
      </Link>

      <div className="h-24" />
      <BottomNav />
    </div>
  )
}
