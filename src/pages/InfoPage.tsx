import { sectionHref } from '../lib/router'

const PAGES: Record<string, { title: string; body: string[] }> = {
  support: { title: 'Support', body: ['LUMIXA is a fictional brand and this site is a front-end demonstration, so there is no support desk behind it.', 'When this becomes a live store, product manuals, firmware and repair requests would live here.'] },
  contact: { title: 'Contact', body: ['There is no contact address for this demonstration site.', 'Replace this page with real contact details, or link it to a form or helpdesk, before launch.'] },
  shipping: { title: 'Shipping and Returns', body: ['No orders are shipped from this demo: checkout does not take payment or create orders.', 'Add your real delivery regions, timings and returns policy here before selling anything.'] },
  privacy: { title: 'Privacy Policy', body: ['This demo stores one thing: the contents of your bag, kept in this browser’s local storage so it survives a refresh. Nothing is sent to a server.', 'Replace this text with a real policy, reviewed for your jurisdiction, before collecting any personal data.'] },
  terms: { title: 'Terms and Conditions', body: ['This site is a demonstration. Prices are placeholders, products are not for sale, and nothing here is an offer.', 'Replace this text with real terms, reviewed for your jurisdiction, before launch.'] },
}

export function InfoPage({ slug }: { slug: string }) {
  const page = PAGES[slug]
  return (
    <div className="page wrap notfound">
      <h1 className="h2">{page ? page.title : 'Page not found'}</h1>
      {page ? page.body.map((b) => <p key={b} className="lede">{b}</p>) : <p className="lede">That page doesn’t exist.</p>}
      <a className="btn btn--ghost" href={sectionHref('collection')}>Back to the collection</a>
    </div>
  )
}
