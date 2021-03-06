import { Convert } from './converter'

const basic = (cssProps: string, styles: string[]) => {
  expect(Convert(`* { ${cssProps} }`)).toStrictEqual([{ selectors: ['*'], styles }])
}

test('common', () => {
  basic('justify-content: normal;', ['justify-content:normal'])
  basic('-webkit-justify-content: normal;', ['justify-content:normal'])
  basic('-webkit-justify-content: normal !important;', ['justify-content:normal!'])
  basic('border-radius: 10;', ['r:10'])
  basic('border-bottom-left-radius: 10;', ['rbl:10'])
  basic(`
  border-bottom-right-radius: 10 !important;
  border-bottom-left-radius: 10;
  `, ['rbl:10', 'rbr:10!'])
  basic('-non-css: 10;', [])
  basic(`
  border-bottom-style:none;
  border-top-style:none;
  `, ['by:none'])
  basic('border-bottom-style:none;', ['bb:none'])
})

test('variable', () => {
  // variable
  basic('padding: var(--foo) 20px', ['p:$(foo);20px'])
  basic('--foo: var(--bar);', ['$foo:$(bar)'])
})
