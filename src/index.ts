import css = require('css')

const obj = css.parse(`body {
    font-size: 12px !important;
    color: red;
}`)

obj.stylesheet.rules.forEach((rule: css.Rule) => {
  console.log(rule.declarations)
})
