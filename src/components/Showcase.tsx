import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { getProduct } from '../data/products'
import { money } from '../lib/format'
import { Link } from '../lib/router'
import { useReducedMotionPref } from '../hooks/useMedia'
import { SafeImg, Sources } from './media'
import { AddButton } from './AddButton'
import { RevealGroup, RevealItem } from './Reveal'

const L1 = getProduct('l1')!

export function Showcase() {
  const vid = useRef<HTMLVideoElement>(null)
  const range = useRef<HTMLInputElement>(null)
  const reduce = useReducedMotionPref()
  const [playing, setPlaying] = useState(!reduce)
  const [failed, setFailed] = useState(false)
  const [variantId, setVariantId] = useState(L1.variants[1].id)
  const variant = L1.variants.find((v) => v.id === variantId)!

  // keep the scrubber in sync with playback without re-rendering React
  useEffect(() => {
    const v = vid.current
    if (!v || failed) return
    let raf = 0
    const tick = () => {
      if (range.current && v.duration && !v.paused) range.current.value = String(v.currentTime / v.duration)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [failed])

  // play only while visible
  useEffect(() => {
    const v = vid.current
    if (!v || reduce || failed) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) v.pause()
        else if (playing) v.play().catch(() => undefined)
      },
      { threshold: 0.3 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [playing, reduce, failed])

  const toggle = () => {
    const v = vid.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => undefined)
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }
  const seek = (value: number) => {
    const v = vid.current
    if (!v || !v.duration) return
    v.pause()
    setPlaying(false)
    v.currentTime = value * v.duration
  }

  return (
    <section id="detail" className="section showcase" aria-labelledby="detail-h">
      <div className="wrap">
        <h2 className="h2 showcase__title"><span id="detail-h">BUILT FOR EVERY DETAIL.</span></h2>
        <div className="showcase__grid">
          <div className="showcase__viewer">
            <div className="viewer vf">
              {failed ? (
                <SafeImg src="/img/poster-rotation.jpg" alt="LUMIXA L1 on a rotating stage" width={1280} height={720} />
              ) : (
                <video
                  ref={vid}
                  poster="/img/poster-rotation.jpg"
                  width={1280}
                  height={720}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="The LUMIXA L1 turning on a stage, showing front, side and rear"
                  disablePictureInPicture
                >
                  <Sources base="/media/camera-rotation" onFail={() => setFailed(true)} />
                </video>
              )}
            </div>
            {!failed && (
              <div className="viewer__bar">
                <button className="icon-btn" onClick={toggle} aria-label={playing ? 'Pause rotation footage' : 'Play rotation footage'}>
                  {playing ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <label className="viewer__scrub">
                  <span className="sr-only">Scrub through the turntable footage</span>
                  <input ref={range} type="range" min={0} max={1} step={0.001} defaultValue={0} onChange={(e) => seek(Number(e.target.value))} />
                </label>
              </div>
            )}
            <p className="muted small viewer__note">Studio footage of the L1 — drag the bar to turn it. This is a video, not an interactive 3D model.</p>
          </div>

          <RevealGroup className="showcase__panel">
            <RevealItem><p className="panel__name">{L1.name}</p><p className="muted">{L1.kind}</p></RevealItem>

            <RevealItem>
              <fieldset className="options">
                <legend className="label">Configuration</legend>
                <div className="options__row">
                  {L1.variants.map((v) => (
                    <label key={v.id} className={`option ${v.id === variantId ? 'is-on' : ''}`}>
                      <input type="radio" name="l1-variant" value={v.id} checked={v.id === variantId} onChange={() => setVariantId(v.id)} />
                      <span className="option__label">{v.label}</span>
                      <span className="option__price">{money(v.price)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </RevealItem>

            <RevealItem>
              <p className="label">Included</p>
              <ul className="included" aria-live="polite">
                {variant.includes.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </RevealItem>

            <RevealItem>
              <table className="specs">
                <caption className="sr-only">LUMIXA L1 specifications</caption>
                <tbody>
                  {L1.specs.map((s) => (
                    <tr key={s.label}>
                      <th scope="row">{s.label}</th>
                      <td className={s.value ? '' : 'pending'}>{s.value ?? 'Awaiting spec sheet'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </RevealItem>

            <RevealItem className="panel__buy">
              <p className="panel__price">{money(variant.price)} <span className="demo-tag">Demo price</span></p>
              <div className="panel__btns">
                <AddButton productId={L1.id} variantId={variant.id} />
                <Link to={`/p/${L1.id}`} className="btn btn--ghost">Full details</Link>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
