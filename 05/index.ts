import * as fs from 'fs'
import * as path from 'path'

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const seatIds = data.split(/\r?\n/).map(s => parseInt(s.replace(/F|L/g, '0').replace(/B|R/g, '1'), 2))
console.log('Data loaded')

seatIds.sort((a, b) => a - b)
console.log('Data sorted')

console.log(`Part 1: Max seating ID ${seatIds[seatIds.length - 1]}`)

for (let i = 1; i < seatIds.length; i++) {
  if (seatIds[i] - 1 !== seatIds[i - 1]) {
    console.log(`Part 2: Discontinuity found ${seatIds.slice(i - 1, i + 1)}`)
  }
}
