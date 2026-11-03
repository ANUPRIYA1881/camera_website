import { useSyncExternalStore } from 'react'

const KEY = 'lumixa.splash.v1'

/** Skip the intro for repeat visits in the same tab and for people who ask for reduced motion. */
function shouldSkip() {
  if (typeof window === 'undefined') return true
  try {
    if (sessionStorage.getItem(KEY)) return true
  } catch {
    /* storage blocked: fall through and show it once per load */
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

let done = shouldSkip()
const subs = new Set<() => void>()

export function finishSplash() {
  if (done) return
  done = true
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    /* ignore */
  }
  subs.forEach((f) => f())
}

/** False while the intro is showing. Other components (the hero) wait for this before running their entrance. */
export function useSplashDone() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb)
      return () => subs.delete(cb)
    },
    () => done,
    () => true,
  )
}
