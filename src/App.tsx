import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { RouterProvider, useRoute } from './lib/router'
import { CartProvider } from './lib/cart'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { SearchOverlay, AccountDialog } from './components/SearchOverlay'
import { Splash } from './components/Splash'
import { ScrollProgress } from './components/ScrollProgress'
import { Home } from './pages/Home'
import { ProductPage } from './pages/ProductPage'
import { Checkout } from './pages/Checkout'
import { InfoPage } from './pages/InfoPage'

const SECTIONS = ['precision', 'collection', 'detail', 'gallery', 'accessories', 'story']

function Shell() {
  const route = useRoute()
  const [search, setSearch] = useState(false)
  const [account, setAccount] = useState(false)
  const [active, setActive] = useState('')

  // scroll to the requested home section (also after navigating back from another page)
  useEffect(() => {
    if (route.path !== '/') return
    const id = route.params.section
    if (!id) return
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    return () => window.clearTimeout(t)
  }, [route.path, route.params.section, route.params.tab])

  // route changes without a section start at the top
  useEffect(() => {
    if (route.path !== '/' || !route.params.section) window.scrollTo({ top: 0 })
  }, [route.path, route.params.section])

  // active section indicator
  useEffect(() => {
    if (route.path !== '/') return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s)
      if (el) io.observe(el)
    })
    const hero = document.getElementById('hero')
    const cta = document.getElementById('cta')
    const clear = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive('')), { rootMargin: '-45% 0px -50% 0px' })
    if (hero) clear.observe(hero)
    if (cta) clear.observe(cta)
    return () => {
      io.disconnect()
      clear.disconnect()
    }
  }, [route.path])

  const seg = route.path.split('/').filter(Boolean)
  let page
  if (route.path === '/') page = <Home />
  else if (seg[0] === 'p' && seg[1]) page = <ProductPage id={seg[1]} />
  else if (seg[0] === 'checkout') page = <Checkout />
  else if (seg[0] === 'info' && seg[1]) page = <InfoPage slug={seg[1]} />
  else page = <InfoPage slug="" />

  return (
    <>
      <Splash />
      <a className="skip" href="#main">Skip to content</a>
      <Nav activeSection={active} onSearch={() => setSearch(true)} onAccount={() => setAccount(true)} />
      <ScrollProgress />
      <main id="main" tabIndex={-1} className="main">{page}</main>
      <Footer />
      <CartDrawer />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
      <AccountDialog open={account} onClose={() => setAccount(false)} />
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider>
        <CartProvider>
          <Shell />
        </CartProvider>
      </RouterProvider>
    </MotionConfig>
  )
}
