import { Link } from '../lib/router'

/** Geometric mark: an aperture ring with an off-centre iris. Rendered as SVG so it stays crisp and themeable. */
export function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 1.75 7.2 10.4h9.6L12 1.75Z" fill="var(--accent)" />
      <circle cx="12" cy="13.2" r="2.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function Wordmark() {
  return (
    <Link to="/" className="wordmark" aria-label="LUMIXA home">
      <Mark />
      <span>LUMIXA</span>
    </Link>
  )
}
