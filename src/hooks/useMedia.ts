import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia(query).matches))
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

/** True for desktop-class devices where scroll-scrubbing a video is smooth. */
export const useCanScrub = () => useMediaQuery('(min-width: 900px) and (hover: hover) and (pointer: fine)')
export const useReducedMotionPref = () => useMediaQuery('(prefers-reduced-motion: reduce)')
