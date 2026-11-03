import { Backpack, BatteryFull, HardDrive } from 'lucide-react'
import type { IconKey, Product } from '../data/products'
import { SafeImg } from './media'

function Tripod() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="2.5" width="8" height="4.5" rx="1" />
      <path d="M12 7v4M12 11 5.5 21.5M12 11l6.5 10.5M12 11v10.5" />
    </svg>
  )
}

export function AccessoryIcon({ icon }: { icon?: IconKey }) {
  const p = { size: 40, strokeWidth: 1.2, 'aria-hidden': true } as const
  switch (icon) {
    case 'bag': return <Backpack {...p} />
    case 'card': return <HardDrive {...p} />
    case 'battery': return <BatteryFull {...p} />
    case 'tripod': return <Tripod />
    default: return null
  }
}

/** Product visual: supplied still when available, otherwise a designed technical placeholder tile. */
export function ProductArt({ product, index = 0, eager, className = '' }: { product: Product; index?: number; eager?: boolean; className?: string }) {
  const img = product.images[index]
  if (img) return <SafeImg src={img.src} alt={img.alt} width={720} height={720} className={className} eager={eager} />
  return (
    <div className={`art-tile ${className}`} role="img" aria-label={`${product.name} — illustration placeholder`}>
      <AccessoryIcon icon={product.icon} />
      <span>{product.kind}</span>
    </div>
  )
}
