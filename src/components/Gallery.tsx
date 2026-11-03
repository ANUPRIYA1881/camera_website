import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { Dialog } from './Dialog'
import { LoopVideo, SafeImg, Sources } from './media'
import { RevealGroup, RevealItem } from './Reveal'

interface Item {
  id: string
  type: 'image' | 'video'
  src: string
  poster?: string
  alt: string
  title: string
  caption: string
  w: number
  h: number
  className: string
  position?: string
}

const ITEMS: Item[] = [
  { id: 'lens', type: 'video', src: '/media/lens-macro', poster: '/img/poster-lens.jpg', alt: 'Slow macro movement across a camera lens, from the front glass to the focus scale and the aperture blades', title: 'Glass, close', caption: 'Macro, lens barrel and iris', w: 1280, h: 720, className: 'g-lens' },
  { id: 'iris', type: 'image', src: '/img/aperture-macro.jpg', alt: 'Macro photograph of brushed-metal aperture blades forming a spiral', title: 'The iris', caption: 'Macro, aperture blades', w: 1600, h: 1136, className: 'g-iris', position: '62% 50%' },
  { id: 'rig', type: 'image', src: '/img/cine-rig-podium.jpg', alt: 'A cinema camera rig with a monitor on an illuminated turntable in a dim studio', title: 'The rig', caption: 'Studio, practical light', w: 675, h: 675, className: 'g-rig' },
  { id: 'rear', type: 'image', src: '/img/camera-rear-detail.jpg', alt: 'Rear of a mirrorless camera against a black background with soft reflections on the surface below', title: 'Rear plate', caption: 'Studio, low-key', w: 1600, h: 1067, className: 'g-rear', position: '50% 40%' },
]

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null)
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + ITEMS.length) % ITEMS.length)), [])

  useEffect(() => {
    if (open === null) return
    const k = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, go])

  const cur = open === null ? null : ITEMS[open]

  return (
    <section id="gallery" className="section gallery" aria-labelledby="gallery-h">
      <div className="wrap">
        <RevealGroup className="gallery__head">
          <RevealItem as="h2"><span id="gallery-h" className="h2">THE WORLD, THROUGH YOUR EYES.</span></RevealItem>
          <RevealItem as="p" className="lede">A set of frames for inspiration. They are not sample images from a LUMIXA camera.</RevealItem>
        </RevealGroup>
      </div>
      <div className="gallery__grid">
        {ITEMS.map((it, i) => (
          <figure key={it.id} className={`gtile ${it.className}`}>
            <button className="gtile__btn" onClick={() => setOpen(i)} aria-label={`Open ${it.title} full size`}>
              {it.type === 'video' ? (
                <LoopVideo base={it.src} poster={it.poster!} label={it.alt} className="gtile__media" />
              ) : (
                <SafeImg src={it.src} alt={it.alt} width={it.w} height={it.h} className={`gtile__media`} style={{ objectPosition: it.position }} />
              )}
              <span className="gtile__open" aria-hidden="true"><Maximize2 size={16} /></span>
            </button>
            <figcaption className="gtile__cap"><strong>{it.title}</strong><span>{it.caption}</span></figcaption>
          </figure>
        ))}
      </div>

      <Dialog open={open !== null} onClose={() => setOpen(null)} label="Image viewer" side="center" className="lightbox">
        {cur && (
          <div className="lightbox__body">
            <div className="lightbox__media">
              {cur.type === 'video' ? (
                <video key={cur.id} poster={cur.poster} muted loop autoPlay playsInline aria-label={cur.alt}><Sources base={cur.src} onFail={() => undefined} /></video>
              ) : (
                <img key={cur.id} src={cur.src} alt={cur.alt} />
              )}
            </div>
            <div className="lightbox__bar">
              <p><strong>{cur.title}</strong> <span className="muted">{cur.caption}</span></p>
              <div className="lightbox__nav">
                <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous image"><ChevronLeft size={20} /></button>
                <span className="muted small" aria-live="polite">{(open ?? 0) + 1} of {ITEMS.length}</span>
                <button className="icon-btn" onClick={() => go(1)} aria-label="Next image"><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </section>
  )
}
