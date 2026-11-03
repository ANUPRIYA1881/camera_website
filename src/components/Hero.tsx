import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useCanScrub, useReducedMotionPref } from '../hooks/useMedia'
import { SafeImg, Sources } from './media'
import { sectionHref } from '../lib/router'
import { useSplashDone } from '../lib/splash'

const VIDEO = '/media/hero-commercial'
const POSTER = '/img/poster-hero.jpg'
const STILL = '/img/hero-end.jpg'

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n))
const ease = [0.22, 1, 0.36, 1] as const

/**
 * Cinematic hero.
 * Desktop (fine pointer, ≥900px, motion allowed): the section is taller than the viewport and the video
 * is scrubbed by scroll position — scrolling dollies the camera in. Time is eased with a lerp inside one rAF loop,
 * and progress is written to a CSS variable so React never re-renders on scroll.
 * Touch / small screens: plain muted looping playback. Reduced motion or load failure: a still frame.
 */
export function Hero() {
  const wrap = useRef<HTMLElement>(null)
  const vid = useRef<HTMLVideoElement>(null)
  const canScrub = useCanScrub()
  const reduce = useReducedMotionPref()
  const [failed, setFailed] = useState(false)
  const ready = useSplashDone() // entrance waits for the intro curtain
  const scrub = canScrub && !reduce && !failed

  useEffect(() => {
    const w = wrap.current
    const v = vid.current
    if (!w || !v || failed || reduce) return
    if (!scrub) {
      v.play().catch(() => undefined)
      return
    }
    v.pause()
    let target = 0
    let cur = 0
    let raf = 0
    const frame = () => {
      raf = 0
      cur += (target - cur) * 0.14
      if (Math.abs(target - cur) < 0.0004) cur = target
      if (v.duration && !v.seeking) {
        const t = cur * (v.duration - 0.05)
        if (Math.abs(v.currentTime - t) > 1 / 60) v.currentTime = t
      }
      if (cur !== target) raf = requestAnimationFrame(frame)
    }
    const measure = () => {
      const max = w.offsetHeight - window.innerHeight
      target = max > 0 ? clamp(-w.getBoundingClientRect().top / max) : 0
      w.style.setProperty('--p', target.toFixed(4))
      if (!raf) raf = requestAnimationFrame(frame)
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      if (raf) cancelAnimationFrame(raf)
      w.style.removeProperty('--p')
    }
  }, [scrub, failed, reduce])

  const showStill = failed || reduce

  return (
    <section ref={wrap} id="hero" className={`hero ${scrub ? 'hero--scrub' : ''}`} aria-label="LUMIXA imaging system">
      <div className="hero__stage">
        <div className="hero__media" aria-hidden={showStill ? undefined : true}>
          {showStill ? (
            <SafeImg src={STILL} alt="LUMIXA camera with lens, lit from the side against a dark background" width={1280} height={720} className="hero__video" eager />
          ) : (
            <video
              ref={vid}
              className="hero__video"
              poster={POSTER}
              muted
              loop={!scrub}
              playsInline
              preload="auto"
              disablePictureInPicture
              tabIndex={-1}
            >
              <Sources base={VIDEO} onFail={() => setFailed(true)} />
            </video>
          )}
        </div>
        <div className="hero__shade" aria-hidden="true" />

        <div className="hero__content">
          <motion.p className="label" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ duration: 1, delay: 0.3 }}>
            THE LUMIXA IMAGING SYSTEM
          </motion.p>
          <h1 className="hero__title">
            {['SEE BEYOND', 'THE FRAME.'].map((line, i) => (
              <span className="hero__line" key={line}>
                <motion.span initial={{ y: '105%' }} animate={ready ? { y: 0 } : undefined} transition={{ duration: 1.1, ease, delay: 0.45 + i * 0.12 }}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="hero__sub" initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease, delay: 1.0 }}>
            Every detail matters. Every moment becomes a masterpiece.
          </motion.p>
          <motion.div className="hero__cta" initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease, delay: 1.25 }}>
            <a className="btn btn--primary" href={sectionHref('collection')}>EXPLORE CAMERAS</a>
            <a className="text-link" href={sectionHref('precision')}>DISCOVER THE LUMIXA DIFFERENCE <span aria-hidden="true">→</span></a>
          </motion.div>
        </div>

        <a className="hero__scroll" href={sectionHref('precision')} aria-label="Scroll to the next section">
          <span>Scroll</span>
          <i aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
