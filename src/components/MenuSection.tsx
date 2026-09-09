import { content } from '../content'
import { MenuCard } from './MenuCard'
import './menu.css'

const ACCENTS = [
  'linear-gradient(145deg, #f0b23c, #e41436)',
  'linear-gradient(145deg, #e41436, #7c0a1e)',
  'linear-gradient(145deg, #f7692f, #c2451f)',
  'linear-gradient(145deg, #ffd980, #f0b23c)',
  'linear-gradient(145deg, #e9d3ab, #c99a4f)',
  'linear-gradient(145deg, #9a4c17, #4d2409)',
]

const ICONS = ['drumstick', 'spicy', 'burger', 'tenders', 'fries', 'sauce'] as const

export function MenuSection() {
  return (
    <section id="menu" className="menu-section">
      <div className="container">
        <div className="menu-heading">
          <p className="eyebrow">{content.menu.kicker}</p>
          <h2>{content.menu.title}</h2>
        </div>
        <div className="menu-grid">
          {content.menu.items.map((item, i) => (
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
