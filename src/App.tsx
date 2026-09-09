import { useMediaFlags } from './hooks/useMediaFlags'
import { Header } from './components/Header'
import { ScrollExperience } from './components/ScrollExperience'
import { MenuSection } from './components/MenuSection'
import { Footer } from './components/Footer'

export default function App() {
  useMediaFlags()

  return (
    <>
      <Header />
      <main id="top">
        <ScrollExperience />
        <MenuSection />
      </main>
      <Footer />
    </>
  )
}
