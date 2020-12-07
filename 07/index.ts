import * as fs from 'fs'
import { sum } from 'lodash'
import * as path from 'path'

class BagSpec {
  contains = new Map<string, number>()
  containedIn = new Set<string>()
}
const bags = new Map<string, BagSpec>()
function getOrMake(color: string) {
  let spec = bags.get(color)
  if (!spec) {
    spec = new BagSpec()
    bags.set(color, spec)
  }
  return spec
}

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const rules = data.split(/\r?\n/)

rules.forEach(r => {
  const color = r.match(/^(.*) bags contain/)![1]
  const spec = getOrMake(color)
  for (const [, count, otherColor] of r.matchAll(/(\d+) (.*?) bags?/g)) {
    spec.contains.set(otherColor, parseInt(count))
    getOrMake(otherColor).containedIn.add(color)
  }
})
console.log('Data loaded')

const toCheck = ['shiny gold']
const parents = new Set<string>()
while (toCheck.length) {
  getOrMake(toCheck.pop()!).containedIn.forEach(pc => {
    if (!parents.has(pc)) {
      parents.add(pc)
      toCheck.push(pc)
    }
  })
}
console.log(`Part 1: count possible parent bags of shiny gold ${parents.size}`)

function countInclusive(color: string): number {
  const spec = getOrMake(color)
  return 1 + sum([...spec.contains.entries()].map(([c, n]) => n * countInclusive(c)))
}
console.log(`Part 2: count inner bags of shiny gold ${countInclusive('shiny gold') - 1}`)
