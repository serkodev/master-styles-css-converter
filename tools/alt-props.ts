import fs from 'fs'
import path from 'path'
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

fs.writeFileSync(path.join(__dirname, '../data/alt-props.json'), JSON.stringify(altPropsMap()))
