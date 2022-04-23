import css = require('css')
import type { PriMapMeta } from 'master-styles-manager/css-properties'
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
  // const map = sorted.reduce((all, decl) => all[decl.property] = decl, {})
  // const findProp = (prop: string): Declaration | undefined => {
  //   return map[prop]
  // }

  const findMasterCSS = (prop: string): PriMapMeta | undefined => {
    const masterCSS = cssPropertyMaster.mapper[prop]
    if (masterCSS) {
      return masterCSS
    }

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

    if (master.related) {
      //
    }

    if (master.vals) {
      // check match condition
      const matchVal = master.vals.find(val => val.eq === declVal)
      if (matchVal !== undefined) {
        all.push(applyStyle(matchVal.style))
        declaration.finish = true
        return all
      }
    }

    if (master.prop) {
      // replace _ to ; ?
      declVal = declVal.replaceAll(/\s/g, '')
      all.push(applyStyle(`${master.prop}:${declVal}`))
      declaration.finish = true
      return all
    }

    return all
  }, <Array<string>>[])

  return output
}

interface DeclarationResult {
  styles: string[]
}

export const Convert = (cssString: string): DeclarationResult[] => {
  const obj = css.parse(cssString)
  const results: DeclarationResult[] = []

  obj.stylesheet!.rules.forEach((rule: css.Rule) => {
    if (rule.declarations) {
      const declarations = rule.declarations.filter(declaration => declaration.type === 'declaration' && (<css.Declaration>declaration).property)
      const o = parseDeclarations(declarations)
      results.push({ styles: o })
    }
  })

  return results
}
