import { CURRENCY } from '../config'

const fmt = new Intl.NumberFormat(CURRENCY.locale, {
  style: 'currency',
  currency: CURRENCY.code,
  maximumFractionDigits: 0,
})
export const money = (n: number) => fmt.format(n)
