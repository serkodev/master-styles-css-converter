import { MdnCompat, flatAlternativeNameResult } from 'mdn-compat-browserlist'
import bcd from '@mdn/browser-compat-data'

// key: prefixed, value: raw
const altPropsMap = (): Record<string, string | string[]> => {
  const result: Record<string, string | string[]> = {}
  const compat = new MdnCompat()
  const allAlts = compat.alternative(bcd.css.properties)

  for (const [prop, alts] of Object.entries(allAlts)) {
    if (Array.isArray(alts) && alts.length === 0)
      continue

    const flats = flatAlternativeNameResult(alts)
    result[prop] = flats
    for (const alt of flats) {
      result[alt] = prop
    }
  }
  return result
}

const map = altPropsMap()

// find all alt property
const altProps = (prop: string): string[] | undefined => {
  const result = map[prop]
  if (result === undefined)
    return

  if (Array.isArray(result))
    return result

  if (typeof result == 'string') {
    const ori = map[result]
    if (Array.isArray(ori)) {
      return ori.filter(op => op !== prop).concat(result)
    }
  }
}

export default altProps
