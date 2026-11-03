import { useEffect, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { useCart } from '../lib/cart'

export function AddButton({ productId, variantId, qty = 1, label = 'Add to bag', className = 'btn btn--primary' }: { productId: string; variantId: string; qty?: number; label?: string; className?: string }) {
  const { add } = useCart()
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!done) return
    const t = window.setTimeout(() => setDone(false), 1600)
    return () => window.clearTimeout(t)
  }, [done])
  return (
    <button
      className={className}
      onClick={() => {
        add(productId, variantId, qty)
        setDone(true)
      }}
    >
      {done ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
      <span>{done ? 'Added' : label}</span>
    </button>
  )
}
