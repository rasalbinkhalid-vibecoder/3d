import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { content, type AppContent, type Lang } from './content'

interface LanguageCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: AppContent
}

const Ctx = createContext<LanguageCtx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('like-lang') : null
    return saved === 'ar' || saved === 'en' ? saved : 'en'
  })

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = content[lang].dir
    try {
      window.localStorage.setItem('like-lang', lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t: content[lang] }), [lang])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLanguage() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
