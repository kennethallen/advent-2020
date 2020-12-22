import { minBy } from 'lodash'
import { loadInput, gcd } from '../util'

interface Bus {
  id: number
  offset: number
}

const data = loadInput(__dirname)
const [earliestDepartData, busesData] = data.split(/\r?\n/)
const earliestDepart = parseInt(earliestDepartData)
const buses: Bus[] = busesData.split(',').map((b, offset) => ({ id: parseInt(b), offset })).filter(({ id }) => !isNaN(id))
console.log('Data loaded')

{
  const { id, depart } = minBy(buses.map(({ id }) => ({ id, depart: Math.ceil(earliestDepart / id) * id })), b => b.depart)!
  console.log(`Part 1: ${id} * (${depart} - ${earliestDepart}) = ${id * (depart - earliestDepart)}`)
}

// Confirm IDs are pairwise coprime, otherwise no (general) solution
for (const [i, { id: a }] of buses.entries()) {
  for (const { id: b } of buses.slice(i + 1)) {
    if (gcd(a, b) !== 1) {
      throw new Error(`All IDs must be pairwise coprime: ${a}, ${b}`)
    }
  }
}
console.log('Part 2: Plug the following system of equivalences into any Chinese remainder theorem solver:')
buses.forEach(({ id, offset }) => console.log(`x ≡ ${(id - (offset % id)) % id} (mod ${id})`))
