import { useLanguage } from '../i18n/LanguageContext'
import { MenuCard } from './MenuCard'
import './menu.css'

const ACCENTS = [
  'linear-gradient(145deg, #f0b23c, #e1361c)',
  'linear-gradient(145deg, #e1361c, #7c130a)',
  'linear-gradient(145deg, #f3893a, #c25a3a)',
  'linear-gradient(145deg, #ffd980, #f0b23c)',
  'linear-gradient(145deg, #e9d3ab, #c99a4f)',
  'linear-gradient(145deg, #9a4c17, #4d2409)',
]

const ICONS = ['drumstick', 'spicy', 'burger', 'tenders', 'fries', 'sauce'] as const

export function MenuSection() {
  const { t } = useLanguage()

  return (
    <section id="menu" className="menu-section">
      <div className="container">
        <div className="menu-heading">
          <p className="eyebrow">{t.menu.kicker}</p>
          <h2>{t.menu.title}</h2>
        </div>
        <div className="menu-grid">
          {t.menu.items.map((item, i) => (
            <MenuCard
              key={item.name}
              name={item.name}
              desc={item.desc}
              price={item.price}
              accent={ACCENTS[i % ACCENTS.length]}
              icon={ICONS[i % ICONS.length]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
