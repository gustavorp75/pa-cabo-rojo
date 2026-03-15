'use client'

import { useLang } from '@/lib/LangContext'
import { beaches, ui, statusLabel } from '@/lib/data'
import TopBar from '@/components/TopBar'
import Nameplate from '@/components/Nameplate'
import BottomNav from '@/components/BottomNav'
import Link from 'next/link'

export default function PlayasPage() {
  const { lang, t } = useLang()

  return (
    <>
      <TopBar />
      <Nameplate />

      <div className="font-condensed text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[var(--muted)] px-4 pt-3 pb-2 border-b-[2px] border-[var(--ink)] bg-[var(--warm-white)]">
        {t(ui.bestBeaches)}
      </div>

      <div className="grid grid-cols-2 border-b-[2px] border-[var(--ink)]">
        {beaches.map((b) => {
          const st = statusLabel[b.status]
          return (
            <Link key={b.slug} href={`/playas/${b.slug}`}
              className="border-r border-b border-[var(--rule)] [&:nth-child(2n)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0 overflow-hidden group">
              <div className={`h-[110px] relative bg-gradient-to-br ${b.gradient} flex items-center justify-center`}>
                <span className="text-[4rem] opacity-25 group-hover:scale-105 transition-transform">{b.emoji}</span>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.5) 100%)' }} />
                <span className="absolute bottom-2 left-2 z-10 font-condensed text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm text-white"
                      style={{ background: st.color }}>
                  {lang === 'es' ? st.es : st.en}
                </span>
              </div>
              <div className="p-3">
                <p className="font-baskerville font-bold text-[0.95rem] text-[var(--ink)] leading-tight mb-1">
                  {lang === 'es' ? b.nameEs : b.nameEn}
                </p>
                <p className="text-[0.66rem] text-[var(--muted)] mb-1.5 leading-relaxed">
                  {lang === 'es' ? b.tagsEs : b.tagsEn}
                </p>
                <p className="font-condensed text-[0.64rem] font-bold tracking-[0.06em] uppercase text-[var(--teal)]">
                  {lang === 'es' ? b.driveEs : b.driveEn}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="h-[70px]" />
      <BottomNav />
    </>
  )
}
