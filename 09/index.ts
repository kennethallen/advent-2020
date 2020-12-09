/* eslint-disable no-labels */
import * as fs from 'fs'
import * as path from 'path'

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const ns = data.split(/\r?\n/).map(s => parseInt(s))
console.log('Data loaded')

const WindowSize = 25

function invalid(n: number) {
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

const addends = new Set(ns.slice(undefined, WindowSize))
for (let i = WindowSize; i < ns.length; i++) {
  const n = ns[i]
  check: {
    for (const a of addends) {
      if (addends.has(n - a)) {
        break check
      }
    }
    console.log(`Part 1: datum #${i} (${n}) is invalid`)
    invalid(n)
  }
  addends.delete(ns[i - WindowSize])
  addends.add(n)
}
