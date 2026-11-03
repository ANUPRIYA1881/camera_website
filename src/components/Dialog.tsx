import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  label: string
  side?: 'right' | 'center' | 'top'
  children: ReactNode
  className?: string
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/** Accessible modal: Escape closes, focus is trapped and restored, page scroll is locked. */
export function Dialog({ open, onClose, label, side = 'center', children, className = '' }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  const last = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    last.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => {
      const el = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current?.querySelector<HTMLElement>(FOCUSABLE)
      el?.focus()
    }, 30)
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !panel.current) return
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', key)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', key)
      document.body.style.overflow = ''
      last.current?.focus?.()
    }
  }, [open, onClose])

  const from = side === 'right' ? { x: '100%' } : side === 'top' ? { y: -40 } : { y: 24, scale: 0.98 }
  return (
    <AnimatePresence>
      {open && (
        <div className={`dialog dialog--${side}`}>
          <motion.div className="dialog__scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className={`dialog__panel ${className}`}
            initial={{ opacity: 0, ...from }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, ...from }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className="icon-btn dialog__close" onClick={onClose} aria-label={`Close ${label.toLowerCase()}`}>
              <X size={20} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
