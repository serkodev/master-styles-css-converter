import { Convert } from './converter'

test('basic', () => {
  const basic = (cssProps: string, styles: string[]) => {
    expect(Convert(`* { ${cssProps} }`)).toStrictEqual([{ styles }])
  }
  basic('justify-content: normal;', ['justify-content:normal'])
  basic('-webkit-justify-content: normal;', ['justify-content:normal'])
  basic('-webkit-justify-content: normal !important;', ['justify-content:normal!'])
})
