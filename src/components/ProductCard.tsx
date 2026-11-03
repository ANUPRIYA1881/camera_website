import type { Product } from '../data/products'
import { lowestPrice } from '../data/products'
import { money } from '../lib/format'
import { Link } from '../lib/router'
import { ProductArt } from './ProductArt'
import { AddButton } from './AddButton'

export function ProductCard({ product, className = '' }: { product: Product; className?: string }) {
  const multi = product.variants.length > 1
  return (
    <article className={`pcard ${className}`}>
      <Link to={`/p/${product.id}`} className="pcard__media vf" aria-label={`View details for ${product.name}`}>
        <ProductArt product={product} className="pcard__img" />
      </Link>
      <div className="pcard__body">
        <div className="pcard__top">
          <div>
            <h3 className="pcard__name">
              <Link to={`/p/${product.id}`}>{product.name}</Link>
            </h3>
            <p className="pcard__kind">{product.kind}</p>
          </div>
          <p className="pcard__price">
            {multi && <span className="small muted">from </span>}
            {money(lowestPrice(product))}
            <span className="demo-tag">Demo price</span>
          </p>
        </div>
        <p className="pcard__desc">{product.tagline}</p>
        <div className="pcard__actions">
          <Link to={`/p/${product.id}`} className="btn btn--ghost">View details</Link>
          {multi ? (
            <Link to={`/p/${product.id}`} className="btn btn--primary">Choose a kit</Link>
          ) : (
            <AddButton productId={product.id} variantId={product.variants[0].id} />
          )}
        </div>
      </div>
    </article>
  )
}
