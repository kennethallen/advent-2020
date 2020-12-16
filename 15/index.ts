import * as fs from 'fs'
import * as path from 'path'

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const start = data.split(/\r?\n/).map(s => parseInt(s))
console.log('Data loaded')

const thresholds = [2020, 30000000]
const maxThreshold = Math.max(...thresholds)

let lastSayAge: number | undefined
const lastSayRounds = new Map<number, number>()
for (let round = 0; round < maxThreshold; round++) {
  const said = start[round] ?? lastSayAge ?? 0
  const lastSayRound = lastSayRounds.get(said)
  lastSayAge = lastSayRound === undefined ? undefined : round - lastSayRound
  lastSayRounds.set(said, round)

  if (thresholds.includes(round + 1)) {
    console.log(`Part ${thresholds.indexOf(round + 1) + 1}: ${round + 1}th number said ${said}`)
  }
}
