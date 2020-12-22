import { range } from "lodash"
import { loadInput } from '../util'

const data = loadInput(__dirname)
const start = data.split(/\r?\n/).map(s => parseInt(s))
console.log('Data loaded')

const thresholds = [2020, 30000000]

let lastSayAge: number | undefined
const lastSayRounds = new Map<number, number>()
for (const round of range(Math.max(...thresholds))) {
  const said = start[round] ?? lastSayAge ?? 0
  const lastSayRound = lastSayRounds.get(said)
  lastSayAge = lastSayRound === undefined ? undefined : round - lastSayRound
  lastSayRounds.set(said, round)

  if (thresholds.includes(round + 1)) {
    console.log(`Part ${thresholds.indexOf(round + 1) + 1}: ${round + 1}th number said ${said}`)
  }
}
