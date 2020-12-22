import { map, range } from 'lodash'
import { loadInput, product } from '../util'

const data = loadInput(__dirname)
const lines = data.split(/\r?\n/)
console.log('Data loaded')

{
  let trees = 0
  let colIdx = 0
  for (const row of lines) {
    const hit = row[colIdx] === '#'
    if (hit) {
      trees++
    }
    colIdx = (colIdx + 3) % row.length
  }
  console.log(`Part 1: ${trees} trees hit`)
}

const vels = [
  { horiz: 1, vert: 1 },
  { horiz: 3, vert: 1 },
  { horiz: 5, vert: 1 },
  { horiz: 7, vert: 1 },
  { horiz: 1, vert: 2 },
].map(v => ({ ...v, trees: 0 }))
for (const vel of vels) {
  vel.trees = 0
  let colIdx = 0
  for (const row of range(0, lines.length, vel.vert).map(i => lines[i])) {
    if (row[colIdx] === '#') {
      vel.trees++
    }
    colIdx = (colIdx + vel.horiz) % row.length
  }
  console.log(`Right ${vel.horiz}, down ${vel.vert}: ${vel.trees} trees`)
}
console.log(`Part 2: ${product(map(vels, 'trees'))}`)
