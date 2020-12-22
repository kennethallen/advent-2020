import { initial, last, tail, zip } from 'lodash'
import { loadInput } from '../util'

const data = loadInput(__dirname)
const seatIds = data.split(/\r?\n/).map(s => parseInt(s.replace(/F|L/g, '0').replace(/B|R/g, '1'), 2))
console.log('Data loaded')

seatIds.sort((a, b) => a - b)
console.log('Data sorted')

console.log('Part 1: Max seating ID', last(seatIds))

for (const [a, b] of zip(initial(seatIds), tail(seatIds))) {
  if (a! !== b! - 1) {
    console.log('Part 2: Discontinuity found', a, b)
  }
}
