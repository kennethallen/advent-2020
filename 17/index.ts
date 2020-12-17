import * as fs from 'fs'
import { chunk, range } from 'lodash'
import * as path from 'path'
import BitSet from 'bitset'

function product(a: number[]) {
  let p = 1
  for (const n of a) {
    p *= n
  }
  return p
}

class State {
  public bits = new BitSet()
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public dims: number[],
    public offset: number[]
  ) {}

  get(x: number, y: number, z: number) {
    x += this.offset[0]
    y += this.offset[1]
    z += this.offset[2]
    if (!(x >= 0 && y >= 0 && z >= 0 && x < this.dims[0] && y < this.dims[1] && z < this.dims[2])) {
      return false
    }
    return this.bits.get(x + this.dims[0] * (y + this.dims[1] * (z))) === 1
  }

  set(x: number, y: number, z: number, b?: boolean) {
    x += this.offset[0]
    y += this.offset[1]
    z += this.offset[2]
    console.assert(x >= 0 && y >= 0 && z >= 0 && x < this.dims[0] && y < this.dims[1] && z < this.dims[2])
    this.bits.set(x + this.dims[0] * (y + this.dims[1] * (z)), (b ?? true) ? 1 : 0)
  }

  countAround(x: number, y: number, z: number) {
    let count = 0
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          if (this.get(x + dx, y + dy, z + dz)) {
            count++
          }
        }
      }
    }
    return count
  }

  step() {
    const newState = new State(this.dims.map(n => n + 2), this.offset.map(n => n + 1))
    range(newState.dims[0]).map(x => x - newState.offset[0]).forEach(x => {
      range(newState.dims[1]).map(y => y - newState.offset[1]).forEach(y => {
        range(newState.dims[2]).map(z => z - newState.offset[2]).forEach(z => {
          const cell = this.get(x, y, z)
          const count = this.countAround(x, y, z)
          if (count === 3 || (cell && count === 4)) {
            newState.set(x, y, z)
          }
        })
      })
    })
    return newState
  }

  toString() {
    return chunk(range(product(this.dims)).map(n => this.bits.get(n)), this.dims[0] * this.dims[1]).map(slice => chunk(slice, this.dims[1]).map(row => row.map(n => n === 1 ? '#' : '.').join('')).join('\n')).join('\n\n')
  }
}

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const lines = data.split(/\r?\n/)
console.log('Data loaded')

const init = new State([lines.length, lines[0].length, 1], [0, 0, 0])
lines.forEach((s, x) => {
  [...s].forEach((c, y) => {
    if (c === '#') {
      init.set(x, y, 0)
    }
  })
})
console.log(init.toString())
console.log(init.step().toString())
let state = init
for (let i = 0; i < 6; i++) {
  state = state.step()
}
console.log(`Part 1: count active ${[...state.bits].filter(b => b === 1).length}`)
