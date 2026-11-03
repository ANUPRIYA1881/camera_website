import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { finishSplash, useSplashDone } from '../lib/splash'

const MIN_MS = 1900 // the intro always plays at least this long, so the animation is never cut off
const MAX_MS = 4500 // and never holds the page hostage on a slow connection
const LETTERS = 'LUMIXA'.split('')
const POSTER = '/img/poster-hero.jpg'

/** Resolves 0..1 as the things the first screen depends on become ready. */
function useReadiness(onProgress: (ready: number) => void) {
  useEffect(() => {
    let fontsOk = false
    let posterOk = false
    let stopped = false

    document.fonts?.ready.then(() => (fontsOk = true)).catch(() => (fontsOk = true))
    if (!document.fonts) fontsOk = true
    const img = new Image()
    img.onload = img.onerror = () => (posterOk = true)
    img.src = POSTER

    const poll = window.setInterval(() => {
      if (stopped) return
      // hero video: ready once the first frames are decodable (or it was removed after a load failure)
      const v = document.querySelector<HTMLVideoElement>('.hero video')
      const videoOk = !v || v.readyState >= 2
      onProgress((Number(fontsOk) + Number(posterOk) + Number(videoOk)) / 3)
    }, 80)
    return () => {
      stopped = true
      window.clearInterval(poll)
    }
  }, [onProgress])
}

function SplashInner() {
  const bar = useRef<HTMLSpanElement>(null)
  const num = useRef<HTMLSpanElement>(null)
  const readiness = useRef(0)
  const onProgress = useRef((r: number) => void (readiness.current = r)).current
  useReadiness(onProgress)

  // lock scroll and hold the page's own entrance animations until the curtain lifts
  useEffect(() => {
    document.documentElement.classList.add('is-splash')
    return () => document.documentElement.classList.remove('is-splash')
  }, [])

  useEffect(() => {
    const start = performance.now()
    let shown = 0
    let raf = 0
    const tick = (now: number) => {
      const elapsed = now - start
      const timeFrac = Math.min(1, elapsed / MIN_MS)
      const target = Math.min(timeFrac, 0.12 + readiness.current * 0.88) // never ahead of what's really loaded
      shown += (target - shown) * 0.18
      const pct = Math.min(100, Math.round(shown * 100))
      if (bar.current) bar.current.style.transform = `scaleX(${shown.toFixed(4)})`
      if (num.current) num.current.textContent = String(pct).padStart(3, '0')
      const ready = readiness.current >= 1 && elapsed >= MIN_MS && shown > 0.985
      if (ready || elapsed >= MAX_MS) {
        finishSplash()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && finishSplash()
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <>
      <p className="sr-only" role="status">Loading LUMIXA</p>
      <div className="splash__center" aria-hidden="true">
        <svg className="splash__mark" viewBox="0 0 24 24" fill="none">
          <circle className="splash__ring" cx="12" cy="12" r="10.25" pathLength="1" stroke="currentColor" strokeWidth="1" />
          <path className="splash__tri" d="M12 1.75 7.2 10.4h9.6L12 1.75Z" fill="var(--accent)" />
          <circle className="splash__eye" cx="12" cy="13.2" r="2.2" stroke="currentColor" strokeWidth="1" />
        </svg>
        <div className="splash__word">
          {LETTERS.map((c, i) => (
            <span key={i} style={{ ['--i' as string]: i }}>{c}</span>
          ))}
        </div>
        <p className="splash__tag">See beyond the frame.</p>
      </div>
      <div className="splash__foot" aria-hidden="true">
        <span className="splash__count"><span ref={num}>000</span><i>%</i></span>
        <span className="splash__track"><span ref={bar} className="splash__fill" /></span>
      </div>
      <button type="button" className="splash__skip" onClick={finishSplash}>Skip intro</button>
    </>
  )
}

export function Splash() {
  const done = useSplashDone()
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="splash"
          className="splash"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <SplashInner />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
