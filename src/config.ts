/** Store-wide settings. Edit here; nothing else hard-codes these values. */
export const CURRENCY = { code: 'USD', locale: 'en-US' } as const

/**
 * Social profiles. Leave `href` empty until real accounts exist —
 * entries without a URL render as disabled, so no invented accounts are linked.
 */
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: 'Instagram', href: '' },
  { label: 'YouTube', href: '' },
  { label: 'X', href: '' },
]

export const CART_STORAGE_KEY = 'lumixa.cart.v1'
