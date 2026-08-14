'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'fr' | 'ar'

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (fr: string, ar: string) => string
  isRTL: boolean
}

const LangContext = createContext<LangContextType>({
  lang: 'ar',
  setLang: () => {},
  t: (fr, ar) => ar,
  isRTL: true,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ar')

  useEffect(() => {
    const saved = localStorage.getItem('proexcel_lang') as Lang | null
    const defaultLang = (saved === 'ar' || saved === 'fr' || saved === 'en') ? saved : 'ar'
    setLangState(defaultLang)
    document.documentElement.setAttribute('dir', defaultLang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', defaultLang)

    // Listen for language change events from Header
    const handler = (e: Event) => {
      const newLang = (e as CustomEvent).detail as Lang
      setLangState(newLang)
    }
    window.addEventListener('proexcel-lang-change', handler)
    return () => window.removeEventListener('proexcel-lang-change', handler)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('proexcel_lang', l)
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000`
    document.documentElement.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', l)
    window.dispatchEvent(new CustomEvent('proexcel-lang-change', { detail: l }))
  }

  const t = (fr: string, ar: string) => lang === 'ar' ? ar : fr

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRTL: lang === 'ar' }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
