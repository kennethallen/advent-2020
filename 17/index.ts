import * as fs from 'fs'
import { chunk, range, sum, times } from 'lodash'
import * as path from 'path'
import BitSet from 'bitset'

function product(ns: number[]) {
  return ns.reduce((a, b) => a * b, 1)
}

class State {
  public bits = new BitSet()
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public dims: number[],
    public offsets: number[]
  ) {}

  bitIndex(coords: number[]) {
    let index = 0
    for (let i = coords.length - 1; i >= 0; i--) {
      const offset = coords[i] + this.offsets[i]
      if (offset < 0 || offset >= this.dims[i]) {
        return undefined
      }
      index = index * this.dims[i] + offset
    }
    return index
  }

  get(coords: number[]) {
    const index = this.bitIndex(coords)
    return index !== undefined && this.bits.get(index) === 1
  }

  set(coords: number[], b?: boolean) {
    const index = this.bitIndex(coords)
    console.assert(index !== undefined)
    return this.bits.set(index, (b ?? true) ? 1 : 0)
  }

  countAround(coords: number[], dim = 0): number {
    if (dim === this.dims.length) {
      return this.get(coords) ? 1 : 0
    } else {
      return sum(range(-1, 2).map(offset => this.countAround([...coords.slice(0, dim), coords[dim] + offset, ...coords.slice(dim + 1)], dim + 1)))
    }
  }

  step() {
    const newState = new State(this.dims.map(n => n + 2), this.offsets.map(n => n + 1))
    newState.fillFromPrev(this)
    return newState
  }

  fillFromPrev(old: State, coords: number[] = []) {
    if (coords.length === this.dims.length) {
      const cell = old.get(coords)
      const count = old.countAround(coords)
      if (count === 3 || (cell && count === 4)) {
        this.set(coords)
      }
    } else {
      range(this.dims[coords.length]).forEach(n => this.fillFromPrev(old, [...coords, n - this.offsets[coords.length]]))
    }
  }

  toString3D() {
    return chunk(range(product(this.dims)).map(n => this.bits.get(n)), this.dims[0] * this.dims[1]).map(slice => chunk(slice, this.dims[1]).map(row => row.map(n => n === 1 ? '#' : '.').join('')).join('\n')).join('\n\n')
  }
}

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const lines = data.split(/\r?\n/)
console.log('Data loaded')

function doPart(part: number, dim: number) {
  const init = new State([lines.length, lines[0].length, ...times(dim - 2, () => 1)], times(dim, () => 0))
  lines.forEach((s, x) => {
    [...s].forEach((c, y) => {
      if (c === '#') {
        init.set([x, y, ...times(dim - 2, () => 0)])
      }
    })
  })

  let state = init
  for (let i = 0; i < 6; i++) {
    state = state.step()
  }
  console.log(`Part ${part}: count active ${[...state.bits].filter(b => b === 1).length}`)
}

doPart(1, 3)
doPart(2, 4)
