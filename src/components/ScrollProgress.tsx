import { motion, useScroll, useSpring } from 'framer-motion'

/** Hairline page-progress indicator on the right edge. Driven by motion values — no React re-renders. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  return (
    <div className="progress" aria-hidden="true">
      <motion.i style={{ scaleY }} />
    </div>
  )
}
