import { range, sum } from 'lodash'
import { loadInput, product } from '../util'

class Range {
  // eslint-disable-next-line no-useless-constructor
  constructor(public lo: number, public hi: number) {}
  has(n: number) {
    return n >= this.lo && n <= this.hi
  }
}

const data = loadInput(__dirname)
const [fieldData, ticketData] = data.split(/(?:\r?\n){2}your ticket:\r?\n/)
const [myTickData, nearTicksData] = ticketData.split(/(?:\r?\n){2}nearby tickets:\r?\n/)
const fields = new Map<string, Range[]>()
fieldData.split(/\r?\n/).forEach(s => {
  const [, name, lo0, hi0, lo1, hi1] = s.match(/^(.*): (\d+)-(\d+) or (\d+)-(\d+)/)!
  fields.set(name, [new Range(parseInt(lo0), parseInt(hi0)), new Range(parseInt(lo1), parseInt(hi1))])
})
function parseTicket(line: string) {
  return line.split(',').map(s => parseInt(s))
}
const myTick = parseTicket(myTickData)
const nearTicks = nearTicksData.split(/\r?\n/).map(parseTicket)
console.log('Data loaded')

const allRanges = [...fields.values()].flat()
console.log(`Part 1: ticket scanning error rate ${sum(nearTicks.flat().filter(n => allRanges.every(r => !r.has(n))))}`)

const validTicks = nearTicks.filter(t => t.every(n => allRanges.some(r => r.has(n))))
const unknownPos = new Map<number, Set<string>>()
range(validTicks[0].length).forEach(i => unknownPos.set(i, new Set(fields.keys())))
const knownPos = new Map<number, string>()
function ruleOut(i: number, f: string) {
  const posFields = unknownPos.get(i)!
  posFields.delete(f)
  if (posFields.size === 1) {
    const defField = [...posFields][0]!
    unknownPos.delete(i)
    knownPos.set(i, defField);
    [...unknownPos.entries()].filter(([, s]) => s.has(defField)).forEach(([i0]) => ruleOut(i0, defField))
  }
}
for (const tick of validTicks) {
  unknownPos.forEach((possibleFields, i) =>
    [...possibleFields].filter(f => !fields.get(f)!.some(r => r.has(tick[i]))).forEach(f => ruleOut(i, f))
  )
}
console.log(`Part 2: product of departure fields ${product(myTick.filter((_, i) => knownPos.get(i)!.startsWith('departure')))}`)
