'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Lang } from '@/lib/data'

interface LangContextType {
  lang: Lang
  toggle: () => void
  t: (obj: { es: string; en: string }) => string
}

const LangContext = createContext<LangContextType>({
  lang: 'es',
  toggle: () => {},
  t: (obj) => obj.es,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('es')

  // persist preference
  useEffect(() => {
    const saved = localStorage.getItem('crh-lang') as Lang | null
    if (saved === 'es' || saved === 'en') setLang(saved)
  }, [])

  const toggle = () => {
    setLang(prev => {
      const next = prev === 'es' ? 'en' : 'es'
      localStorage.setItem('crh-lang', next)
      document.documentElement.lang = next
      return next
    })
  }

  const t = (obj: { es: string; en: string }) => obj[lang]

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
