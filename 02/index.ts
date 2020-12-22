import { loadInput } from '../util'

interface Entry {
  n0: number
  n1: number
  char: string
  pw: string
}

const data = loadInput(__dirname)
const entries: Entry[] = [...data.matchAll(/^(\d+)-(\d+) ([a-z]): ([a-z]+)$/gm)]
  .map(([, s0, s1, char, pw]) => ({ char, pw, n0: parseInt(s0), n1: parseInt(s1) }))
console.log('Data loaded')

console.log(`Part 1: ${entries.filter(({ n0, n1, char, pw }) => {
  const count = [...pw].filter(c => c === char).length
  return count >= n0 && count <= n1
}).length} correct`)
console.log(`Part 2: ${entries.filter(({ n0, n1, char, pw }) => (pw[n0 - 1] === char) !== (pw[n1 - 1] === char)).length} correct`)
