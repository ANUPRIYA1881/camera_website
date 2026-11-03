import { useState, type FormEvent } from 'react'
import { Wordmark } from './Brand'
import { Link, sectionHref } from '../lib/router'
import { SOCIAL_LINKS } from '../config'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function Footer() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<{ kind: 'idle' | 'error' | 'ok'; msg: string }>({ kind: 'idle', msg: '' })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const v = email.trim()
    if (!v) return setState({ kind: 'error', msg: 'Enter your email address.' })
    if (!EMAIL.test(v)) return setState({ kind: 'error', msg: 'Enter a valid email address, like name@example.com.' })
    // No backend is connected: validate only, never claim the address was stored or mailed.
    setState({ kind: 'ok', msg: `Looks good. This demo does not send or store email, so ${v} has not been subscribed.` })
    setEmail('')
  }

  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Wordmark />
          <p className="muted footer__about">Premium mirrorless cameras, professional lenses and imaging accessories. Precision engineering meets creative freedom.</p>
          <form className="news" onSubmit={submit} noValidate>
            <label htmlFor="news-email" className="label">Newsletter</label>
            <div className="news__row">
              <input id="news-email" type="email" inputMode="email" autoComplete="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={state.kind === 'error'} aria-describedby="news-msg" />
              <button className="btn btn--primary" type="submit">Sign up</button>
            </div>
            <p id="news-msg" role={state.kind === 'error' ? 'alert' : 'status'} className={`news__msg news__msg--${state.kind}`}>{state.msg}</p>
          </form>
        </div>

        <nav className="footer__col" aria-label="Shop">
          <p className="label">Shop</p>
          <a href={sectionHref('collection')}>Shop Cameras</a>
          <a href={sectionHref('accessories', { tab: 'lenses' })}>Shop Lenses</a>
          <a href={sectionHref('accessories', { tab: 'bags' })}>Accessories</a>
          <a href={sectionHref('precision')}>Our Technology</a>
        </nav>
        <nav className="footer__col" aria-label="Help">
          <p className="label">Help</p>
          <Link to="/info/support">Support</Link>
          <Link to="/info/contact">Contact</Link>
          <Link to="/info/shipping">Shipping and Returns</Link>
        </nav>
        <nav className="footer__col" aria-label="Legal">
          <p className="label">Legal</p>
          <Link to="/info/privacy">Privacy Policy</Link>
          <Link to="/info/terms">Terms and Conditions</Link>
        </nav>
        <div className="footer__col">
          <p className="label">Follow</p>
          {SOCIAL_LINKS.map((s) =>
            s.href ? (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
            ) : (
              <span key={s.label} className="is-disabled" aria-disabled="true" title="Add this profile URL in src/config.ts">{s.label}</span>
            ),
          )}
        </div>
      </div>
      <div className="wrap footer__legal">
        <p className="muted small">© {new Date().getFullYear()} LUMIXA. A fictional brand — this is a front-end demonstration. Prices are placeholders and no orders are taken.</p>
      </div>
    </footer>
  )
}
