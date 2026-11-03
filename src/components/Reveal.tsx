import { motion, type Variants } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

/** Staggered group: children wrapped in <RevealItem> rise in sequence when the group enters the viewport. */
export function RevealGroup({ children, className, stagger = 0.09, as = 'div' }: { children: ReactNode; className?: string; stagger?: number; as?: 'div' | 'ul' | 'dl' | 'section' }) {
  const M = motion[as] as ElementType
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </M>
  )
}

export function RevealItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'p' | 'h2' | 'h3' | 'li' | 'dt' | 'dd' | 'span' }) {
  const M = motion[as] as ElementType
  return (
    <M className={className} variants={item}>
      {children}
    </M>
  )
}
