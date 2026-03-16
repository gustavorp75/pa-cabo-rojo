'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/LangContext'

const navItems = [
  {
    href: '/',
    imgES: '/images/nav/hoy-button.webp',
    imgEN: '/images/nav/home-button.webp',
    labelES: 'Hoy',
    labelEN: 'Home',
  },
  {
    href: '/playas',
    imgES: '/images/nav/playa--button.webp',
    imgEN: '/images/nav/beach-button.webp',
    labelES: 'Playas',
    labelEN: 'Beach',
  },
  {
    href: '/food',
    imgES: '/images/nav/comidas-button.webp',
    imgEN: '/images/nav/dining-button.webp',
    labelES: 'Comidas',
    labelEN: 'Dining',
  },
  {
    href: '/tonight',
    imgES: '/images/nav/noche-button.webp',
    imgEN: '/images/nav/nightlife-button.webp',
    labelES: 'Noche',
    labelEN: 'Nightlife',
  },
  {
    href: '/map',
    imgES: '/images/nav/mapa--button.webp',
    imgEN: '/images/nav/map-button.webp',
    labelES: 'Mapa',
    labelEN: 'Map',
  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { lang } = useLang()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex z-50"
      style={{
        background: 'var(--ink)',
        borderTop: '2px solid var(--teal)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {navItems.map(item => {
        const active = pathname === item.href ||
          (pathname.startsWith(item.href + '/') && item.href !== '/')
        const img = lang === 'es' ? item.imgES : item.imgEN
        const label = lang === 'es' ? item.labelES : item.labelEN

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center py-1.5 transition-all"
            style={{
              borderRight: '1px solid rgba(255,255,255,0.07)',
              background: active ? 'rgba(26,122,110,0.15)' : 'transparent',
            }}
          >
            <div style={{
              position: 'relative',
              width: 52,
              height: 52,
              borderRadius: 10,
              overflow: 'hidden',
              border: active ? '2px solid var(--teal-light)' : '2px solid transparent',
              boxShadow: active ? '0 0 10px rgba(43,169,154,0.4)' : 'none',
              transition: 'all 0.2s',
              opacity: active ? 1 : 0.75,
            }}>
              <img
                src={img}
                alt={label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: active ? 'brightness(1.15)' : 'brightness(0.9)',
                  transition: 'filter 0.2s',
                }}
              />
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
