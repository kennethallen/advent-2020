import * as fs from 'fs'
import { range, sum } from 'lodash'
import * as path from 'path'

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const adapters = data.split(/\r?\n/).map(s => parseInt(s))
console.log('Data loaded')

adapters.sort((a, b) => a - b)

const diffCounts = new Map<number, number>()
const joltages = [0, ...adapters, adapters[adapters.length - 1] + 3]
for (let i = 1; i < joltages.length; i++) {
  const diff = joltages[i] - joltages[i - 1]
  diffCounts.set(diff, (diffCounts.get(diff) ?? 0) + 1)
}
console.log(`Part 1: diff counts ${[...diffCounts.entries()]}, count(1) * count(3) = ${(diffCounts.get(1) ?? 0) * (diffCounts.get(3) ?? 0)}`)

const paths = new Map<number, number>()
paths.set(0, 1)
for (let i = 1; i < joltages.length; i++) {
  paths.set(joltages[i],
    sum(range(joltages[i] - 3, joltages[i]).map(i => paths.get(i)))
  )
}
console.log(...paths.entries())
console.log(`Part 2: path count ${paths.get(joltages[joltages.length - 1])}`)
