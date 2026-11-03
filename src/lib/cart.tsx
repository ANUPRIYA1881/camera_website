import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { CART_STORAGE_KEY } from '../config'
import { getProduct } from '../data/products'

export interface CartLine {
  productId: string
  variantId: string
  qty: number
}
type Action =
  | { type: 'add'; line: CartLine }
  | { type: 'setQty'; productId: string; variantId: string; qty: number }
  | { type: 'remove'; productId: string; variantId: string }
  | { type: 'clear' }

const MAX_QTY = 10

/** Reads the stored cart defensively: bad JSON, unknown products or silly quantities are dropped. */
function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    const out: CartLine[] = []
    for (const item of data) {
      if (!item || typeof item !== 'object') continue
      const { productId, variantId, qty } = item as Record<string, unknown>
      if (typeof productId !== 'string' || typeof variantId !== 'string' || typeof qty !== 'number') continue
      const p = getProduct(productId)
      if (!p || !p.variants.some((v) => v.id === variantId)) continue
      const q = Math.max(1, Math.min(MAX_QTY, Math.floor(qty)))
      if (!Number.isFinite(q)) continue
      const existing = out.find((l) => l.productId === productId && l.variantId === variantId)
      if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + q)
      else out.push({ productId, variantId, qty: q })
    }
    return out
  } catch {
    return []
  }
}

const same = (a: CartLine, productId: string, variantId: string) => a.productId === productId && a.variantId === variantId

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case 'add': {
      const found = state.find((l) => same(l, action.line.productId, action.line.variantId))
      if (found) return state.map((l) => (l === found ? { ...l, qty: Math.min(MAX_QTY, l.qty + action.line.qty) } : l))
      return [...state, { ...action.line, qty: Math.min(MAX_QTY, action.line.qty) }]
    }
    case 'setQty':
      if (action.qty < 1) return state.filter((l) => !same(l, action.productId, action.variantId))
      return state.map((l) => (same(l, action.productId, action.variantId) ? { ...l, qty: Math.min(MAX_QTY, action.qty) } : l))
    case 'remove':
      return state.filter((l) => !same(l, action.productId, action.variantId))
    case 'clear':
      return []
  }
}

export interface DetailedLine extends CartLine {
  name: string
  variantLabel: string
  unitPrice: number
  lineTotal: number
  image?: string
  imageAlt?: string
  icon?: string
}

interface CartApi {
  lines: DetailedLine[]
  count: number
  subtotal: number
  open: boolean
  setOpen: (v: boolean) => void
  add: (productId: string, variantId: string, qty?: number) => void
  setQty: (productId: string, variantId: string, qty: number) => void
  remove: (productId: string, variantId: string) => void
  clear: () => void
  maxQty: number
}

const Ctx = createContext<CartApi | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [open, setOpenState] = useReducer((_: boolean, v: boolean) => v, false)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable (private mode / quota) — cart still works for this session */
    }
  }, [state])

  const add = useCallback((productId: string, variantId: string, qty = 1) => {
    dispatch({ type: 'add', line: { productId, variantId, qty } })
    setOpenState(true)
  }, [])

  const api = useMemo<CartApi>(() => {
    const lines: DetailedLine[] = state.flatMap((l) => {
      const p = getProduct(l.productId)
      const v = p?.variants.find((x) => x.id === l.variantId)
      if (!p || !v) return []
      return [{
        ...l,
        name: p.name,
        variantLabel: p.variants.length > 1 ? v.label : p.kind,
        unitPrice: v.price,
        lineTotal: v.price * l.qty,
        image: p.images[0]?.src,
        imageAlt: p.images[0]?.alt,
        icon: p.icon,
      }]
    })
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      open,
      setOpen: setOpenState,
      add,
      setQty: (productId, variantId, qty) => dispatch({ type: 'setQty', productId, variantId, qty }),
      remove: (productId, variantId) => dispatch({ type: 'remove', productId, variantId }),
      clear: () => dispatch({ type: 'clear' }),
      maxQty: MAX_QTY,
    }
  }, [state, open, add])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart must be used inside CartProvider')
  return c
}
