import { initial, last, range, sum, tail, zip } from 'lodash'
import { loadInput } from '../util'

const data = loadInput(__dirname)
const adapters = data.split(/\r?\n/).map(s => parseInt(s))
console.log('Data loaded')

adapters.sort((a, b) => a - b)

const diffCounts = new Map<number, number>()
const joltages = [0, ...adapters, last(adapters)! + 3]
for (const [a, b] of zip(initial(joltages), tail(joltages))) {
  const diff = b! - a!
  diffCounts.set(diff, (diffCounts.get(diff) ?? 0) + 1)
}
console.log(`Part 1: diff counts ${[...diffCounts.entries()]}, count(1) * count(3) = ${(diffCounts.get(1) ?? 0) * (diffCounts.get(3) ?? 0)}`)

const paths = new Map<number, number>()
paths.set(0, 1)
for (const joltage of tail(joltages)) {
  paths.set(joltage, sum(range(joltage - 3, joltage).map(i => paths.get(i))))
}
console.log(`Part 2: path count ${paths.get(last(joltages)!)}`)
