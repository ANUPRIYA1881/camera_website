import { motion } from 'framer-motion'
import { SafeImg } from './media'
import { RevealGroup, RevealItem } from './Reveal'
import { sectionHref } from '../lib/router'

export function FinalCTA() {
  return (
    <section id="cta" className="cta" aria-labelledby="cta-h">
      <motion.div className="cta__bg" initial={{ scale: 1.18, opacity: 0.2 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}>
        <SafeImg src="/img/hero-end.jpg" alt="" width={1280} height={720} />
      </motion.div>
      <div className="cta__shade" aria-hidden="true" />
      <RevealGroup className="cta__content wrap">
        <RevealItem as="h2"><span id="cta-h" className="h2 h2--xl">YOUR NEXT FRAME STARTS HERE.</span></RevealItem>
        <RevealItem as="p" className="lede">Explore the tools that bring your creative vision into focus.</RevealItem>
        <RevealItem className="cta__btns">
          <a className="btn btn--primary" href={sectionHref('collection')}>SHOP CAMERAS</a>
          <a className="btn btn--ghost" href={sectionHref('accessories', { tab: 'lenses' })}>EXPLORE THE COLLECTION</a>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}
