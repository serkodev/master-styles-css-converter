import css from 'css'
import type { MapMeta, PriMapMeta } from 'master-styles-manager/css-properties'
import CSSProperties from 'master-styles-manager/css-properties'
import { Styles } from '@master/styles'
import AltProps from './alt-props'

// TODO: font-family: green -> f:green

const cssPropertyMaster = new CSSProperties()
Styles.forEach((style) => { cssPropertyMaster.process(style) })

const normalizeVariable = (value: string): string => {
  const vals = value
    .replace(/,\s+/g, ',')
    .split(/\s/).map((val) => {
      const matches = val.match(/^var\(--(.+)\)$/)
      if (matches !== null) {
        return `$(${matches[1]})`
      }
      return val
    })
  return vals.join(';')
}

const parseDeclarations = (declarations: Array<css.Declaration>): { styles: string[]; errorProperties: string[] } => {
  interface Declaration {
    value: string
    property: string
    finish: boolean
  }

  // filter no-property and sort accending
  const decls = (declarations as Array<Declaration>)
    .filter(decl => decl.property !== undefined && decl.value !== undefined)
    .sort((a, b) => (a.property > b.property) ? 1 : ((b.property > a.property) ? -1 : 0))
    .map(decl => (decl as Declaration))

  // map property
  const map = decls.reduce((all, decl) => {
    all[decl.property] = decl
    return all
  }, <Record<string, Declaration>>{})

  const findDecl = (prop: string): Declaration | undefined => {
    // TODO: if multi alt props with different value?
    const decl = map[prop]
    if (decl && !decl.finish)
      return decl

    // search for prefixed proerty (e.g. -webkit-)
    const alts = AltProps(prop)
    if (!alts)
      return

    for (const alt of alts) {
      const altDecl = map[alt]
      if (altDecl && !decl.finish)
        return altDecl
    }
  }

  const findMasterCSS = (prop: string): PriMapMeta | undefined => {
    const masterCSS = cssPropertyMaster.mapper[prop]
    if (masterCSS)
      return masterCSS

    // search for prefixed proerty (e.g. -webkit-)
    const alts = AltProps(prop)
    if (!alts)
      return

    for (const alt of alts) {
      const altMasterCSS = cssPropertyMaster.mapper[alt]
      if (altMasterCSS)
        return altMasterCSS
    }
  }

  const errorPropertiesMap: Record<string, true> = {}

  const output = decls.reduce((all, declaration) => {
    if (declaration.finish)
      return all

    const { property } = declaration
    const _value = declaration.value
    let value = _value.trim()

    // check empty
    if (value === '') {
      return all
    }

    // check is important
    let isImportant = false
    const applyStyle = (style: string): string => style + (isImportant ? '!' : '')
    if (value.endsWith('!important')) {
      value = value.substring(0, value.lastIndexOf('!important'))
      value = value.trim()
      isImportant = true
    }

    // check is variable
    if (property.startsWith('--')) {
      const varProp = property.substring(2)
      if (!varProp)
        return all

      // replace continuous spaces to semi
      const val = normalizeVariable(value)
      const style = `$${varProp}:${val}`
      all[style] = true
      declaration.finish = true
      return all
    }

    // check is supported css property
    const master = findMasterCSS(property)
    if (!master) {
      // not supported CSS
      errorPropertiesMap[property] = true
      return all
    }

    const getMapMetaStyle = (map: MapMeta): string | undefined => {
      if (map.vals) {
        // check match condition
        const matchVal = map.vals.find(val => val.eq === value)
        if (matchVal !== undefined) {
          return applyStyle(matchVal.style)
        }
      }
      if (map.prop) {
        // replace continuous spaces to semi
        const val = normalizeVariable(value)
        return applyStyle(`${map.prop}:${val}`)
      }
    }

    if (master.related) {
      const related = master.related
      const relatedKeys = Object.keys(related)
      // sort by related props count DESC
        .sort((a, b) => (b.split(' ').length - 1) - (a.split(' ').length - 1))

      for (const key of relatedKeys) {
        const props = key.split(' ')
        const allMatch = props.every((prop) => {
          const decl = findDecl(prop)
          return decl && decl.value === value
        })

        if (allMatch) {
          const relateItem = related[key]
          const style = getMapMetaStyle(relateItem)
          if (style !== undefined) {
            all[style] = true
            declaration.finish = true
            props.forEach((prop) => {
              map[prop].finish = true
            })
            return all
          }
        }
      }
    }

    const style = getMapMetaStyle(master)
    if (style !== undefined) {
      all[style] = true
      declaration.finish = true
      return all
    }

    return all
  }, <Record<string, true>>{})

  return {
    styles: Object.keys(output),
    errorProperties: Object.keys(errorPropertiesMap),
  }
}

export interface DeclarationResult {
  selectors?: string[]
  styles: string[]
  errorProperties: string[]
}

export const Convert = (cssString: string): DeclarationResult[] | undefined => {
  try {
    const obj = css.parse(cssString)
    if (obj.stylesheet && obj.stylesheet.rules) {
      const results: DeclarationResult[] = []
      for (const _rule of obj.stylesheet.rules) {
        const rule: css.Rule = _rule
        if (rule.declarations !== undefined) {
          const declarations = rule.declarations.filter(decl => decl.type === 'declaration' && (<css.Declaration>decl).property)
          const o = parseDeclarations(declarations)
          results.push({ selectors: rule.selectors, ...o })
        }
      }
      return results
    }
  }
  catch (e) {}
}
