import { LanguageProvider } from './i18n/LanguageContext'
import { useMediaFlags } from './hooks/useMediaFlags'
import { Header } from './components/Header'
import { StorySection } from './components/StorySection'
import { MenuSection } from './components/MenuSection'
import { BrandMoment } from './components/BrandMoment'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'

function AppShell() {
  useMediaFlags()

  return (
    <>
      <Header />
      <main id="top">
        <StorySection />
        <MenuSection />
        <BrandMoment />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  )
}
