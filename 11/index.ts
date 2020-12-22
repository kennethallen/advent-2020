import { isEqual, range } from 'lodash'
import { loadInput } from '../util'

class Seats {
  // eslint-disable-next-line no-useless-constructor
  constructor(public rows: string[][]) {}

  isOccup([i, j]: number[]) {
    return this.rows[i][j] === '#'
  }

  countAdjOccup(i: number, j: number) {
    return range(Math.max(0, i - 1), Math.min(i + 2, this.rows.length)).flatMap(i0 =>
      range(Math.max(0, j - 1), Math.min(j + 2, this.rows[i0].length)).map(j0 => [i0, j0])
    ).filter(([i0, j0]) => i !== i0 || j !== j0).filter(this.isOccup, this).length
  }

  step(ruleset: 1 | 2) {
    return new Seats(range(this.rows.length).map(i =>
      range(this.rows[i].length).map(j => {
        switch (this.rows[i][j]) {
          case 'L':
            return (ruleset === 1 ? this.countAdjOccup(i, j) : this.countSeenOccup(i, j)) === 0 ? '#' : 'L'
          case '#':
            return (ruleset === 1 ? this.countAdjOccup(i, j) >= 4 : this.countSeenOccup(i, j) >= 5) ? 'L' : '#'
          default:
            return '.'
        }
      })
    ))
  }

  static directions = range(-1, 2).flatMap(di => range(-1, 2).map(dj => [di, dj]))
    .filter(([di, dj]) => di !== 0 || dj !== 0)

  countSeenOccup(i: number, j: number) {
    return Seats.directions.filter(([di, dj]) => {
      let i0 = i
      let j0 = j
      while (true) {
        i0 += di
        j0 += dj
        if (i0 < 0 || i0 >= this.rows.length || j0 < 0 || j0 >= this.rows[i0].length) {
          return false
        }
        switch (this.rows[i0][j0]) {
          case '#': return true
          case 'L': return false
        }
      }
    }).length
  }

  stabilize(ruleset: 1 | 2) {
    let next: Seats = this
    let prev
    do {
      prev = next
      next = prev.step(ruleset)
    } while (!isEqual(next, prev))
    return next
  }
}

const data = loadInput(__dirname)
const init = new Seats(data.split(/\r?\n/).map(s => [...s]))
console.log('Data loaded')

const rulesets: (1 | 2)[] = [1, 2]
rulesets.forEach(n => console.log(`Part ${n}: ${[...init.stabilize(n).rows.join('')].filter(s => s === '#').length} seats filled`))
