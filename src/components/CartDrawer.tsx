import { Minus, Plus, Trash2 } from 'lucide-react'
import { Dialog } from './Dialog'
import { useCart } from '../lib/cart'
import { money } from '../lib/format'
import { Link, sectionHref } from '../lib/router'
import { SafeImg } from './media'
import { AccessoryIcon } from './ProductArt'
import type { IconKey } from '../data/products'

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, count, setQty, remove, maxQty } = useCart()
  const close = () => setOpen(false)
  return (
    <Dialog open={open} onClose={close} label="Shopping bag" side="right" className="drawer">
      <div className="drawer__head">
        <h2 className="drawer__title">Your bag <span aria-live="polite">({count})</span></h2>
      </div>
      {lines.length === 0 ? (
        <div className="drawer__empty">
          <p className="drawer__empty-title">Your bag is empty.</p>
          <p className="muted">Add a camera or lens and it will appear here.</p>
          <a className="btn btn--primary" href={sectionHref('collection')} onClick={close}>Browse cameras</a>
        </div>
      ) : (
        <>
          <ul className="drawer__lines">
            {lines.map((l) => (
              <li key={l.productId + l.variantId} className="line">
                <Link to={`/p/${l.productId}`} className="line__img" onClick={close} aria-label={`View ${l.name}`}>
                  {l.image ? <SafeImg src={l.image} alt={l.imageAlt ?? l.name} width={720} height={720} /> : <span className="line__icon"><AccessoryIcon icon={l.icon as IconKey} /></span>}
                </Link>
                <div className="line__body">
                  <p className="line__name">{l.name}</p>
                  <p className="muted line__variant">{l.variantLabel}</p>
                  <div className="qty" role="group" aria-label={`Quantity for ${l.name}`}>
                    <button onClick={() => setQty(l.productId, l.variantId, l.qty - 1)} aria-label="Decrease quantity"><Minus size={15} /></button>
                    <output aria-live="polite">{l.qty}</output>
                    <button onClick={() => setQty(l.productId, l.variantId, l.qty + 1)} disabled={l.qty >= maxQty} aria-label="Increase quantity"><Plus size={15} /></button>
                  </div>
                </div>
                <div className="line__side">
                  <p className="line__price">{money(l.lineTotal)}</p>
                  <button className="link-btn" onClick={() => remove(l.productId, l.variantId)} aria-label={`Remove ${l.name} from bag`}>
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="drawer__foot">
            <div className="drawer__sub"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <p className="muted small">Demo prices. Shipping and tax are not calculated in this demo.</p>
            <Link to="/checkout" className="btn btn--primary btn--block" onClick={close}>Continue to demo checkout</Link>
          </div>
        </>
      )}
    </Dialog>
  )
}
