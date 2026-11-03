import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotionPref } from '../hooks/useMedia'

/**
 * MP4 (H.264) first, WebM (VP9) second. Errors from <source> do not bubble to <video>,
 * so the failure callback is attached to the last source only.
 */
export function Sources({ base, onFail }: { base: string; onFail: () => void }) {
  return (
    <>
      <source src={`${base}.mp4`} type='video/mp4; codecs="avc1.640028"' />
      <source src={`${base}.webm`} type='video/webm; codecs="vp9"' onError={onFail} />
    </>
  )
}

interface ImgProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  eager?: boolean
  style?: CSSProperties
}

/** Image with intrinsic size (no layout shift), lazy loading and a designed fallback if the file is missing. */
export function SafeImg({ src, alt, width, height, className, eager, style }: ImgProps) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`img-fallback ${className ?? ''}`} role="img" aria-label={alt} style={{ aspectRatio: `${width}/${height}`, ...style }}>
        <span>Image unavailable</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

interface LoopVideoProps {
  /** path without extension, e.g. /media/lens-macro (expects .mp4 and .webm) */
  base: string
  poster: string
  label: string
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

/**
 * Muted looping video that only plays while on screen.
 * - metadata-only preload, poster shown first
 * - reduced motion: poster only
 * - playback failure: falls back to the poster image
 */
export function LoopVideo({ base, poster, label, width = 1280, height = 720, className, style }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const reduce = useReducedMotionPref()

  useEffect(() => {
    const v = ref.current
    if (!v || reduce || failed) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => undefined)
        else v.pause()
      },
      { threshold: 0.25 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [reduce, failed])

  if (failed || reduce) {
    return <SafeImg src={poster} alt={label} width={width} height={height} className={className} style={style} />
  }
  return (
    <video
      ref={ref}
      className={className}
      style={style}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      disablePictureInPicture
    >
      <Sources base={base} onFail={() => setFailed(true)} />
    </video>
  )
}
