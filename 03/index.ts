import fs from 'fs'
import path from 'path'

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const lines = data.split(/\r?\n/)
if (lines[lines.length - 1] === '') {
  lines.splice(lines.length - 1)
}
console.log('Data loaded')

{
  let trees = 0
  for (let row = 0, col = 0; row < lines.length; row++) {
    const hit = lines[row][col] === '#'
    if (hit) {
      trees++
    }
    col = (col + 3) % lines[row].length
  }
  console.log(`Part 1: ${trees} trees hit.`)
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
  for (let row = 0, col = 0; row < lines.length; row += vel.vert) {
    if (lines[row][col] === '#') {
      vel.trees++
    }
    col = (col + vel.horiz) % lines[row].length
  }
  console.log(`Right ${vel.horiz}, down ${vel.vert}: ${vel.trees} trees`)
}
console.log(`Part 2: ${vels.reduce((prod, v) => prod * v.trees, 1)}`)
