'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/LangContext'
const navItems = [
  {href:'/',        icon:'🏠', labelES:'Hoy',    labelEN:'Today'},
  {href:'/playas', icon:'🏖️', labelES:'Playas', labelEN:'Beaches'},
  {href:'/food',    icon:'🍽️', labelES:'Comida', labelEN:'Food'},
  {href:'/tonight', icon:'🌙', labelES:'Noche',  labelEN:'Tonight'},
  {href:'/map',     icon:'📍', labelES:'Mapa',   labelEN:'Map'},
]
export default function BottomNav() {
  const pathname = usePathname()
  const { lang } = useLang()
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex z-50"
      style={{background:'var(--ink)',borderTop:'3px solid var(--teal)',paddingBottom:'env(safe-area-inset-bottom,0px)'}}>
      {navItems.map(item=>{
        const active = pathname===item.href||pathname.startsWith(item.href+'/')&&item.href!=='/'
        return (
          <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center py-2 transition-colors"
            style={{borderRight:'1px solid rgba(255,255,255,0.07)',background:active?'rgba(26,122,110,0.2)':'transparent'}}>
            <span className="text-lg leading-none">{item.icon}</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",color:active?'var(--teal-light)':'rgba(255,255,255,0.4)',letterSpacing:'0.1em'}}
              className="text-[0.54rem] font-bold uppercase mt-1">
              {lang==='es'?item.labelES:item.labelEN}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
