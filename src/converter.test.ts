import { Convert } from './converter'

test('basic', () => {
  const basic = (cssProps: string, styles: string[]) => {
    expect(Convert(`* { ${cssProps} }`)).toStrictEqual([{ styles }])
  }
  basic('justify-content: normal;', ['justify-content:normal'])
  basic('-webkit-justify-content: normal;', ['justify-content:normal'])
  basic('-webkit-justify-content: normal !important;', ['justify-content:normal!'])
  basic('border-radius: 10;', ['r:10'])
  basic('border-bottom-left-radius: 10;', ['rbl:10'])
  basic(`
  border-bottom-right-radius: 10;
  border-bottom-left-radius: 10;
  `, ['rb:10'])
})
