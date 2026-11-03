import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useReducedMotionPref } from '../hooks/useMedia'
import { LoopVideo } from './media'
import { RevealGroup, RevealItem } from './Reveal'

const PRINCIPLES = [
  { title: 'Precision in every detail', text: 'Small decisions, made carefully, add up to a camera you stop thinking about.' },
  { title: 'Freedom to create', text: 'Controls that get out of the way, so the idea reaches the frame intact.' },
  { title: 'Built around the photographer', text: 'Every product starts from how it is held, carried and used.' },
]

export function Story() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const reduce = useReducedMotionPref()
  // trigger on the unclipped wrapper: a fully clipped element can never report as "in view"
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const shown = inView || reduce
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section id="story" className="section story" aria-labelledby="story-h">
      <div className="wrap story__grid">
        <div ref={ref} className="story__media">
          <motion.div
            className="story__visual vf"
            initial={{ clipPath: reduce ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)' }}
            animate={{ clipPath: shown ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)' }}
            transition={{ duration: 1.3, ease: [0.77, 0, 0.175, 1] }}
          >
            <motion.div className="story__video" style={{ y }}>
              <LoopVideo base="/media/photographer" poster="/img/poster-photographer.jpg" label="A photographer in a dark jacket raises a camera toward a mountain ridge at sunrise" />
            </motion.div>
          </motion.div>
        </div>

        <RevealGroup className="story__copy">
          <RevealItem as="h2"><span id="story-h" className="h2">MADE FOR THE MOMENTS THAT MATTER.</span></RevealItem>
          <RevealItem as="p" className="lede">From the first light of morning to the final frame of the day, your tools should never limit your vision.</RevealItem>
          <ul className="principles">
            {PRINCIPLES.map((p) => (
              <RevealItem as="li" key={p.title} className="principle">
                <h3>{p.title}</h3>
                <p className="muted">{p.text}</p>
              </RevealItem>
            ))}
          </ul>
        </RevealGroup>
      </div>
    </section>
  )
}
