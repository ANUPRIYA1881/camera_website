import { useState, type FormEvent } from 'react'
import { Link, sectionHref } from '../lib/router'
import { useCart } from '../lib/cart'
import { money } from '../lib/format'
import { SafeImg } from '../components/media'
import { AccessoryIcon } from '../components/ProductArt'
import type { IconKey } from '../data/products'

type Errors = Partial<Record<'name' | 'email' | 'address' | 'city', string>>

export function Checkout() {
  const { lines, subtotal, count, clear } = useCart()
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState<{ total: number; count: number } | null>(null)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    const err: Errors = {}
    if (!get('name')) err.name = 'Enter a name for the delivery.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(get('email'))) err.email = 'Enter a valid email address.'
    if (!get('address')) err.address = 'Enter a street address.'
    if (!get('city')) err.city = 'Enter a city or town.'
    setErrors(err)
    if (Object.keys(err).length) {
      const first = Object.keys(err)[0]
      ;(e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus()
      return
    }
    setDone({ total: subtotal, count })
    clear()
  }

  if (done) {
    return (
      <div className="page wrap notfound">
        <p className="label">Demo checkout complete</p>
        <h1 className="h2">No order was placed.</h1>
        <p className="lede">You reviewed {done.count} {done.count === 1 ? 'item' : 'items'} totalling {money(done.total)}. Nothing was charged, saved or sent, because this site has no payment or order system connected.</p>
        <a className="btn btn--primary" href={sectionHref('collection')}>Keep browsing</a>
      </div>
    )
  }

  if (!lines.length) {
    return (
      <div className="page wrap notfound">
        <h1 className="h2">Your bag is empty.</h1>
        <p className="lede">Add something to the bag, then come back to review it.</p>
        <a className="btn btn--primary" href={sectionHref('collection')}>Browse cameras</a>
      </div>
    )
  }

  const field = (name: keyof Errors, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="field">
      <label htmlFor={`co-${name}`}>{label}</label>
      <input id={`co-${name}`} name={name} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `co-${name}-e` : undefined} {...props} />
      {errors[name] && <p className="field__err" id={`co-${name}-e`} role="alert">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="page">
      <div className="wrap">
        <h1 className="h2">Demo checkout</h1>
        <p className="notice">This is a demonstration. No payment details are requested and no order will be created.</p>
        <div className="checkout">
          <form onSubmit={submit} noValidate className="checkout__form">
            <h2 className="h3">Delivery details</h2>
            {field('name', 'Full name', { autoComplete: 'name' })}
            {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
            {field('address', 'Street address', { autoComplete: 'street-address' })}
            {field('city', 'City or town', { autoComplete: 'address-level2' })}
            <button className="btn btn--primary btn--block" type="submit">Review demo order</button>
          </form>
          <aside className="checkout__summary" aria-label="Order summary">
            <h2 className="h3">Order summary</h2>
            <ul>
              {lines.map((l) => (
                <li key={l.productId + l.variantId} className="sum">
                  <span className="sum__img">{l.image ? <SafeImg src={l.image} alt="" width={720} height={720} /> : <AccessoryIcon icon={l.icon as IconKey} />}</span>
                  <span><strong>{l.name}</strong><br /><span className="muted small">{l.variantLabel} · Qty {l.qty}</span></span>
                  <span>{money(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="drawer__sub"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <p className="muted small">Shipping and tax are not calculated in this demo.</p>
            <Link to="/" className="text-link">Continue browsing</Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
