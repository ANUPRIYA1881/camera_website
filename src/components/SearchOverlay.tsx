import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Dialog } from './Dialog'
import { PRODUCTS } from '../data/products'
import { money } from '../lib/format'
import { lowestPrice } from '../data/products'
import { Link } from '../lib/router'
import { ProductArt } from './ProductArt'

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return PRODUCTS
    return PRODUCTS.filter((p) => [p.name, p.kind, p.category, p.tagline, p.description].join(' ').toLowerCase().includes(term))
  }, [q])
  const done = () => {
    onClose()
    setQ('')
  }
  return (
    <Dialog open={open} onClose={done} label="Search" side="top" className="search">
      <label className="search__field">
        <Search size={20} aria-hidden="true" />
        <span className="sr-only">Search products</span>
        <input data-autofocus type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cameras, lenses and accessories" autoComplete="off" />
      </label>
      <p className="muted small search__count" aria-live="polite">
        {q.trim() ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${q.trim()}”` : 'All products'}
      </p>
      {results.length === 0 ? (
        <p className="search__none">No products match “{q.trim()}”. Try “lens”, “camera” or “bag”.</p>
      ) : (
        <ul className="search__list">
          {results.map((p) => (
            <li key={p.id}>
              <Link to={`/p/${p.id}`} className="search__row" onClick={done}>
                <span className="search__thumb"><ProductArt product={p} /></span>
                <span>
                  <span className="search__name">{p.name}</span>
                  <span className="muted small search__kind">{p.kind}</span>
                </span>
                <span className="search__price">from {money(lowestPrice(p))}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  )
}

export function AccountDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} label="Account" side="center" className="account">
      <h2 className="account__title">Accounts are not connected</h2>
      <p className="muted">This is a front-end demo, so sign-in and order history are not available. Your bag is stored in this browser only.</p>
      <button className="btn btn--ghost" onClick={onClose} data-autofocus>Close</button>
    </Dialog>
  )
}
