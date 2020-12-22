/* eslint-disable no-labels */
import { range, take } from 'lodash'
import { loadInput } from '../util'

const data = loadInput(__dirname)
const ns = data.split(/\r?\n/).map(s => parseInt(s))
console.log('Data loaded')

const WindowSize = 25

function invalid(n: number) {
  console.log(`Part 1: datum ${n} is invalid`)
  let lo = 0
  let hi = 0
  let sum = 0
  while (sum !== n) {
    if (sum < n) {
      sum += ns[hi]
      hi++
    } else {
      sum -= ns[lo]
      lo++
    }
  }
  const range = ns.slice(lo, hi)
  console.log(`Part 2: ${n} = sum(${range}) (min ${Math.min(...range)}, max ${Math.max(...range)}, sum ${Math.min(...range) + Math.max(...range)})`)
}

const addends = new Set(take(ns, WindowSize))
for (const i of range(WindowSize, ns.length)) {
  const n = ns[i]
  check: {
    for (const a of addends) {
      if (addends.has(n - a)) {
        break check
      }
    }
    invalid(n)
  }
  addends.delete(ns[i - WindowSize])
  addends.add(n)
}
