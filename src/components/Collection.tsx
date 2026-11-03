import { useMemo, useState } from 'react'
import { PRODUCTS, type Category } from '../data/products'
import { ProductCard } from './ProductCard'
import { RevealGroup, RevealItem } from './Reveal'

const FILTERS: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'cameras', label: 'Cameras' },
  { id: 'lenses', label: 'Lenses' },
]

export function Collection() {
  const [filter, setFilter] = useState<'all' | Category>('all')
  const items = useMemo(() => PRODUCTS.filter((p) => p.category !== 'accessories' && (filter === 'all' || p.category === filter)), [filter])

  return (
    <section id="collection" className="section collection" aria-labelledby="collection-h">
      <div className="wrap">
        <RevealGroup className="collection__head">
          <RevealItem as="h2"><span id="collection-h" className="h2">FIND YOUR PERSPECTIVE.</span></RevealItem>
          <RevealItem className="collection__tools">
            <p className="muted small collection__note">Prices are demo placeholders. Specifications appear only where they are known.</p>
            <div className="chips" role="group" aria-label="Filter the collection">
              {FILTERS.map((f) => (
                <button key={f.id} className="chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
          </RevealItem>
        </RevealGroup>
        <p className="sr-only" aria-live="polite">{items.length} products shown</p>
        <div className="collection__grid">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} className={`pcard--${i % 5}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
