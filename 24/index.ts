import { range, rangeRight, repeat, sum, times } from 'lodash'
import os from 'os'
import { loadInput } from '../util'

class Floor {
  readonly tiles = new Map<number, Set<number>>()

  maxX = 0
  minX = 0
  maxY = 0
  minY = 0

  get(x: number, y: number) {
    const col = this.tiles.get(x)
    return col !== undefined && col.has(y)
  }

  set(x: number, y: number, val = true) {
    const col = this.tiles.get(x)
    if (val) {
      this.maxX = Math.max(this.maxX, x)
      this.minX = Math.min(this.minX, x)
      this.maxY = Math.max(this.maxY, y)
      this.minY = Math.min(this.minY, y)
      if (col) {
        col.add(y)
      } else {
        this.tiles.set(x, new Set([y]))
      }
    } else if (col) {
      col.delete(y)
      if (col.size === 0) {
        this.tiles.delete(x)
      }
    }
  }

  flip(x: number, y: number) {
    this.set(x, y, !this.get(x, y))
  }

  size() {
    return sum([...this.tiles.values()].map(col => col.size))
  }

  private static adjacentDiffs = [[0, -1], [-1, -1], [-1, 0], [1, 0], [1, 1], [0, 1]]
  countAround(x: number, y: number) {
    return Floor.adjacentDiffs.filter(([dx, dy]) => this.get(x + dx, y + dy)).length
  }

  toString() {
    const bits: string[] = []
    for (const y of rangeRight(this.minY, this.maxY + 1)) {
      bits.push(repeat(' ', this.maxY - y))
      for (const x of range(this.minX, this.maxX + 1)) {
        bits.push(this.get(x, y) ? '#' : '.')
        bits.push(x === 0 && y === 0 ? '<' : ' ')
      }
      bits.push(os.EOL)
    }
    return bits.join('')
  }
}

const data = loadInput(__dirname)
const paths = data.split(/\r?\n/).map(s => [...s.match(/[ns]?[ew]/g)!])
console.log('Data loaded')

let floor = new Floor()
paths.forEach(path => {
  let x = 0
  let y = 0
  path.forEach(dir => {
    switch (dir) {
      case 'e': x++; break
      case 'w': x--; break
      case 'nw': y++; break
      case 'se': y--; break
      case 'ne': x++; y++; break
      case 'sw': x--; y--; break
    }
  })
  floor.flip(x, y)
})
console.log('Part 1: total black tiles', floor.size())

times(100, () => {
  const newFloor = new Floor()
  for (const x of range(floor.minX - 2, floor.maxX + 3)) {
    for (const y of range(floor.minY - 2, floor.maxY + 3)) {
      const count = floor.countAround(x, y)
      if (count === 2 || (count === 1 && floor.get(x, y))) {
        newFloor.set(x, y)
      }
    }
  }
  floor = newFloor
})
console.log('Part 2: total black tiles', floor.size())
