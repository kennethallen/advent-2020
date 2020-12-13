import * as fs from 'fs'
import { minBy } from 'lodash'
import * as path from 'path'

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const lines = data.split(/\r?\n/)
const earliestDepart = parseInt(lines[0])
const buses = lines[1].split(',').map((b, offset) => ({ id: parseInt(b), offset })).filter(({ id }) => !isNaN(id))
console.log('Data loaded')

{
  const { id, depart } = minBy(buses.map(({ id }) => ({ id, depart: Math.ceil(earliestDepart / id) * id })), ({ depart }) => depart)!
  console.log(`Part 1: ${id} * (${depart} - ${earliestDepart}) = ${id * (depart - earliestDepart)}`)
}

function gcd(x: number, y: number) {
  x = Math.abs(x)
  y = Math.abs(y)
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x
}

// Confirm IDs are pairwise coprime, otherwise no (general) solution
for (let i = 0; i < buses.length; i++) {
  const a = buses[i].id
  for (const { id: b } of buses.slice(i + 1)) {
    if (gcd(a, b) !== 1) {
      throw new Error(`All IDs must be pairwise coprime: ${a}, ${b}`)
    }
  }
}
console.log('Part 2: Plug the following system of equations into any Chinese remainder theorem solver:')
buses.forEach(({ id, offset }) => console.log(`x ≡ ${(id - (offset % id)) % id} (mod ${id})`))
