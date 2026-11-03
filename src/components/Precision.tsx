import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { SafeImg } from './media'
import { useReducedMotionPref } from '../hooks/useMedia'
import { RevealGroup, RevealItem } from './Reveal'

const FEATURES = [
  { title: 'Precision optical engineering', text: 'Glass, coatings and an iris of finely cut blades, designed to be looked at as closely as they are looked through.' },
  { title: 'Responsive manual controls', text: 'Dials, rings and switches placed where a hand already is, so settings change without breaking concentration.' },
  { title: 'Advanced imaging performance', text: 'A system tuned around the picture you want to make. Full specifications will be published with each product.' },
]

export function Precision() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotionPref()
  // the trigger lives on an unclipped wrapper: an element that is fully clipped can never report as "in view"
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1.02])
  const shown = inView || reduce

  return (
    <section id="precision" className="section precision" aria-labelledby="precision-h">
      <div className="wrap precision__grid">
        <div ref={ref} className="precision__media">
          <motion.figure
            className="precision__figure vf"
            initial={{ clipPath: reduce ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
            animate={{ clipPath: shown ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
            transition={{ duration: 1.3, ease: [0.77, 0, 0.175, 1] }}
          >
            <motion.div style={{ scale }} className="precision__img">
              <SafeImg src="/img/aperture-macro.jpg" alt="Close-up of a lens aperture: overlapping brushed-metal blades spiralling toward a dark central opening" width={1600} height={1136} eager />
            </motion.div>
            <figcaption className="figcap">Aperture blades, macro</figcaption>
          </motion.figure>
        </div>

        <RevealGroup className="precision__copy">
          <RevealItem as="h2"><span id="precision-h" className="h2">ENGINEERED TO SEE MORE.</span></RevealItem>
          <RevealItem as="p" className="lede">Every surface, control, and optical element is designed to put precision directly in your hands.</RevealItem>
          <dl className="features">
            {FEATURES.map((f) => (
              <RevealItem key={f.title} className="features__row">
                <dt>{f.title}</dt>
                <dd>{f.text}</dd>
              </RevealItem>
            ))}
          </dl>
        </RevealGroup>
      </div>
    </section>
  )
}
