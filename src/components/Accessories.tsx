import { useEffect, useState } from 'react'
import { ACCESSORY_TABS, PRODUCTS, lowestPrice, tabForProduct, type AccessoryTab } from '../data/products'
import { money } from '../lib/format'
import { Link, useRoute } from '../lib/router'
import { LoopVideo } from './media'
import { ProductArt } from './ProductArt'
import { AddButton } from './AddButton'
import { RevealGroup, RevealItem } from './Reveal'

export function Accessories() {
  const route = useRoute()
  const [tab, setTab] = useState<AccessoryTab>('lenses')

  useEffect(() => {
    const t = route.params.tab as AccessoryTab | undefined
    if (t && ACCESSORY_TABS.some((x) => x.id === t)) setTab(t)
  }, [route.params.tab, route.params.section])

  const items = PRODUCTS.filter((p) => tabForProduct(p) === tab)

  return (
    <section id="accessories" className="section accessories" aria-labelledby="acc-h">
      <div className="wrap accessories__grid">
        <div className="accessories__visual">
          <div className="vf accessories__video">
            <LoopVideo base="/media/lens-macro" poster="/img/poster-lens.jpg" label="Slow macro movement across a camera lens: front glass, aperture blades, focus scale and barrel" />
          </div>
          <p className="figcap">Lens detail, macro</p>
        </div>

        <div className="accessories__panel">
          <RevealGroup>
            <RevealItem as="h2"><span id="acc-h" className="h2">COMPLETE YOUR VISION.</span></RevealItem>
            <RevealItem as="p" className="lede">Lenses first, then everything that gets the camera there and keeps it steady.</RevealItem>
          </RevealGroup>

          <div className="tabs" role="tablist" aria-label="Shop by category">
            {ACCESSORY_TABS.map((t) => (
              <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls="acc-panel" tabIndex={tab === t.id ? 0 : -1} className="tab" onClick={() => setTab(t.id)}
                onKeyDown={(e) => {
                  const i = ACCESSORY_TABS.findIndex((x) => x.id === tab)
                  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    const n = ACCESSORY_TABS[(i + (e.key === 'ArrowRight' ? 1 : -1) + ACCESSORY_TABS.length) % ACCESSORY_TABS.length]
                    setTab(n.id)
                    document.getElementById(`tab-${n.id}`)?.focus()
                  }
                }}>
                {t.label}
              </button>
            ))}
          </div>

          <ul id="acc-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="rows">
            {items.map((p) => (
              <li key={p.id} className="row">
                <Link to={`/p/${p.id}`} className="row__thumb" aria-label={`View ${p.name}`}><ProductArt product={p} /></Link>
                <div className="row__main">
                  <h3 className="row__name"><Link to={`/p/${p.id}`}>{p.name}</Link></h3>
                  <p className="muted small">{p.tagline}</p>
                  <p className="row__compat small"><span>Compatibility</span> {p.compat}</p>
                </div>
                <div className="row__buy">
                  <p className="row__price">{money(lowestPrice(p))}<span className="demo-tag">Demo price</span></p>
                  <AddButton productId={p.id} variantId={p.variants[0].id} className="btn btn--ghost btn--sm" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
