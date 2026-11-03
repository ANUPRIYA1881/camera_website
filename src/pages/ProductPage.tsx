import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { PRODUCTS, getProduct } from '../data/products'
import { money } from '../lib/format'
import { sectionHref } from '../lib/router'
import { ProductArt } from '../components/ProductArt'
import { AddButton } from '../components/AddButton'
import { ProductCard } from '../components/ProductCard'
import { Minus, Plus } from 'lucide-react'

export function ProductPage({ id }: { id: string }) {
  const product = getProduct(id)
  const [img, setImg] = useState(0)
  const [variantId, setVariantId] = useState('')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    const p = getProduct(id)
    setImg(0)
    setQty(1)
    setVariantId(p ? p.variants[p.variants.length - 1].id : '')
    window.scrollTo({ top: 0 })
  }, [id])

  if (!product) {
    return (
      <div className="page wrap notfound">
        <h1 className="h2">That product isn’t in the catalogue.</h1>
        <p className="lede">It may have been renamed. Head back to the collection to keep browsing.</p>
        <a className="btn btn--primary" href={sectionHref('collection')}>Browse cameras</a>
      </div>
    )
  }
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[product.variants.length - 1]
  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).concat(PRODUCTS.filter((p) => p.category !== product.category)).slice(0, 3)
  const back = product.category === 'cameras' ? sectionHref('collection') : sectionHref('accessories', { tab: product.category === 'lenses' ? 'lenses' : 'bags' })

  return (
    <div className="page">
      <div className="wrap">
        <a href={back} className="back"><ArrowLeft size={16} aria-hidden="true" /> Back to {product.category}</a>
        <div className="pdp">
          <div className="pdp__gallery">
            <div className="pdp__main vf">
              <ProductArt product={product} index={img} eager />
            </div>
            {product.images.length > 1 && (
              <ul className="pdp__thumbs" aria-label="Product views">
                {product.images.map((im, i) => (
                  <li key={im.src}>
                    <button className={i === img ? 'is-on' : ''} onClick={() => setImg(i)} aria-label={`Show view ${i + 1} of ${product.images.length}`} aria-pressed={i === img}>
                      <ProductArt product={product} index={i} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pdp__info">
            <p className="label">{product.kind}</p>
            <h1 className="h2 pdp__name">{product.name}</h1>
            <p className="lede">{product.description}</p>

            {product.variants.length > 1 && (
              <fieldset className="options">
                <legend className="label">Configuration</legend>
                <div className="options__row">
                  {product.variants.map((v) => (
                    <label key={v.id} className={`option ${v.id === variant.id ? 'is-on' : ''}`}>
                      <input type="radio" name="variant" checked={v.id === variant.id} onChange={() => setVariantId(v.id)} />
                      <span className="option__label">{v.label}</span>
                      <span className="option__price">{money(v.price)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div>
              <p className="label">Included</p>
              <ul className="included" aria-live="polite">{variant.includes.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>

            <p className="panel__price">{money(variant.price * qty)} <span className="demo-tag">Demo price</span></p>
            <div className="pdp__buy">
              <div className="qty" role="group" aria-label="Quantity">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={15} /></button>
                <output aria-live="polite">{qty}</output>
                <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity"><Plus size={15} /></button>
              </div>
              <AddButton productId={product.id} variantId={variant.id} qty={qty} />
            </div>

            <table className="specs">
              <caption className="specs__cap">Specifications</caption>
              <tbody>
                {product.specs.map((s) => (
                  <tr key={s.label}>
                    <th scope="row">{s.label}</th>
                    <td className={s.value ? '' : 'pending'}>{s.value ?? 'Awaiting spec sheet'}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row">Compatibility</th>
                  <td>{product.compat}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <section className="related" aria-labelledby="rel-h">
          <h2 className="h3" id="rel-h">Also in the system</h2>
          <div className="related__grid">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
