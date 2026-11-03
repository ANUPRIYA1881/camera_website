import { createContext, useContext, useEffect, useMemo, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'

/**
 * Tiny hash router: "#/path?key=value".
 * Hash routing needs no server rewrites, so the build works on any static host.
 */
export interface Route {
  path: string
  params: Record<string, string>
}

function parse(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, query = ''] = raw.split('?')
  const params: Record<string, string> = {}
  new URLSearchParams(query).forEach((v, k) => (params[k] = v))
  return { path: path || '/', params }
}

const RouteCtx = createContext<Route>({ path: '/', params: {} })

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(parse)
  useEffect(() => {
    const on = () => setRoute(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const value = useMemo(() => route, [route])
  return <RouteCtx.Provider value={value}>{children}</RouteCtx.Provider>
}

export const useRoute = () => useContext(RouteCtx)

export const href = (path: string, params?: Record<string, string>) => {
  const q = params ? new URLSearchParams(params).toString() : ''
  return `#${path}${q ? `?${q}` : ''}`
}
/** Link to a home-page section. */
export const sectionHref = (section: string, extra?: Record<string, string>) => href('/', { section, ...extra })

export function Link({ to, params, ...rest }: { to: string; params?: Record<string, string> } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  return <a href={href(to, params)} {...rest} />
}
