import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { Wordmark } from './Brand'
import { Link, sectionHref, useRoute } from '../lib/router'
import { useCart } from '../lib/cart'

const LINKS = [
  { label: 'Cameras', section: 'collection', extra: undefined },
  { label: 'Lenses', section: 'accessories', extra: { tab: 'lenses' } },
  { label: 'Accessories', section: 'accessories', extra: { tab: 'bags' } },
  { label: 'Our Technology', section: 'precision', extra: undefined },
  { label: 'Discover', section: 'story', extra: undefined },
] as const

interface Props {
  activeSection: string
  onSearch: () => void
  onAccount: () => void
}

export function Nav({ activeSection, onSearch, onAccount }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const { count, setOpen } = useCart()
  const route = useRoute()
  const firstLink = useRef<HTMLAnchorElement>(null)
  const onHome = route.path === '/'

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    if (menu) firstLink.current?.focus()
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', esc)
    return () => {
      window.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [menu])

  useEffect(() => setMenu(false), [route.path, route.params.section])

  const solid = scrolled || !onHome || menu

  return (
    <header className={`nav ${solid ? 'nav--solid' : ''}`}>
      <div className="nav__inner">
        <Wordmark />
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => {
            const active = onHome && activeSection === l.section && l.label !== 'Lenses'
            return (
              <a key={l.label} href={sectionHref(l.section, l.extra)} className="nav__link" aria-current={active ? 'true' : undefined}>
                {l.label}
              </a>
            )
          })}
        </nav>
        <div className="nav__actions">
          <button className="icon-btn" onClick={onSearch} aria-label="Search products">
            <Search size={19} />
          </button>
          <button className="icon-btn nav__account" onClick={onAccount} aria-label="Account">
            <User size={19} />
          </button>
          <button className="icon-btn bag-btn" onClick={() => setOpen(true)} aria-label={`Shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`}>
            <ShoppingBag size={19} />
            <span className={`bag-btn__count ${count ? 'is-on' : ''}`} aria-hidden="true">{count}</span>
          </button>
          <button className="icon-btn nav__burger" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? 'Close menu' : 'Open menu'}>
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {LINKS.map((l, i) => (
              <motion.a
                key={l.label}
                ref={i === 0 ? firstLink : undefined}
                href={sectionHref(l.section, l.extra)}
                className="mobile-menu__link"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.5 }}
                onClick={() => setMenu(false)}
              >
                {l.label}
              </motion.a>
            ))}
            <Link to="/info/support" className="mobile-menu__sub" onClick={() => setMenu(false)}>Support</Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
