'use client'
import { useLang } from '@/lib/LangContext'

export default function TopBar() {
  const { lang, toggle } = useLang()
  const now = new Date()
  const daysES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
  const daysEN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const mthES  = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  const mthEN  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const dateStr = lang === 'es'
    ? `${daysES[now.getDay()]} · ${now.getDate()} ${mthES[now.getMonth()]} ${now.getFullYear()} · Cabo Rojo, PR`
    : `${daysEN[now.getDay()]} · ${now.getDate()} ${mthEN[now.getMonth()]} ${now.getFullYear()} · Cabo Rojo, PR`
  return (
    <div style={{background:'var(--ink)'}} className="flex justify-between items-center px-4 h-9 gap-3">
      <span style={{fontFamily:"'Barlow Condensed',sans-serif",color:'rgba(255,255,255,0.4)',letterSpacing:'0.14em'}}
        className="text-[0.6rem] font-semibold uppercase truncate">{dateStr}</span>
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:'var(--teal-light)'}}/>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",color:'var(--teal-light)',letterSpacing:'0.16em'}}
            className="text-[0.6rem] font-bold uppercase">{lang==='es'?'En Vivo':'Live'}</span>
        </div>
        <button onClick={toggle} className="flex items-center overflow-hidden rounded-sm cursor-pointer"
          style={{border:'1px solid rgba(255,255,255,0.14)',background:'rgba(255,255,255,0.08)'}}>
          {(['es','en'] as const).map(l=>(
            <span key={l} style={{fontFamily:"'Barlow Condensed',sans-serif",
              background:lang===l?'var(--teal)':'transparent',
              color:lang===l?'#fff':'rgba(255,255,255,0.4)',letterSpacing:'0.1em',transition:'all 0.18s'}}
              className="text-[0.65rem] font-bold uppercase px-2 py-1 leading-none">
              {l.toUpperCase()}
            </span>
          ))}
        </button>
      </div>
    </div>
  )
}
