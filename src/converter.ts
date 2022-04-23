import css from 'css'
import type { MapMeta, PriMapMeta } from 'master-styles-manager/css-properties'
import CSSProperties from 'master-styles-manager/css-properties'
import { Styles } from '@master/styles'
import AltProps from './alt-props'

const cssPropertyMaster = new CSSProperties()
Styles.forEach((style) => { cssPropertyMaster.process(style) })

const parseDeclarations = (declarations: Array<css.Declaration>): string[] => {
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

  const output = decls.reduce((all, declaration) => {
    if (declaration.finish)
      return all

    const { property, value } = declaration

    // check is important
    let isImportant = false
    const applyStyle = (style: string): string => style + (isImportant ? '!' : '')
    let declVal = value.trim()
    if (declVal.endsWith('!important')) {
      declVal = declVal.substring(0, declVal.lastIndexOf('!important'))
      declVal = declVal.trim()
      isImportant = true
    }

    // check is supported css property
    const master = findMasterCSS(property)
    if (!master) {
      // not supported CSS
      console.log('unsupport CSS property', property)
      return all
    }

    const getMapMetaStyle = (map: MapMeta): string | undefined => {
      if (map.vals) {
        // check match condition
        const matchVal = map.vals.find(val => val.eq === declVal)
        if (matchVal !== undefined) {
          return applyStyle(matchVal.style)
        }
      }
      if (map.prop) {
        const val = declVal.replaceAll(/\s/g, ';')
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
            all.push(style)
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
      all.push(style)
      declaration.finish = true
      return all
    }

    return all
  }, <Array<string>>[])

  return output
}

export interface DeclarationResult {
  selectors?: string[]
  styles: string[]
}

export const Convert = (cssString: string): DeclarationResult[] => {
  const obj = css.parse(cssString)
  const results: DeclarationResult[] = []

  if (obj.stylesheet && obj.stylesheet.rules) {
    obj.stylesheet.rules.forEach((rule: css.Rule) => {
      if (rule.declarations) {
        const declarations = rule.declarations.filter(declaration => declaration.type === 'declaration' && (<css.Declaration>declaration).property)
        const o = parseDeclarations(declarations)
        results.push({ selectors: rule.selectors, styles: o })
      }
    })
  }

  return results
}
