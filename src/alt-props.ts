import props from '../data/alt-props.json'

const map = props as unknown as (Record<string, string | string[]>)

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
