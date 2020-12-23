import { intersection, without } from 'lodash'
import { loadInput } from '../util'

interface Food {
  ingreds: string[]
  allergs: string[]
}

const data = loadInput(__dirname)
const foods: Food[] = data.split(/\r?\n/).map(row => {
  const [, i, a] = row.match(/^([a-z]+(?: [a-z]+)*) \(contains ([a-z]+(?:, [a-z]+)*)\)$/)!
  return { ingreds: i.split(' '), allergs: a.split(', ') }
})
console.log('Data loaded')

const ingredAllerg = new Map<string, string>()
{
  const assocIngreds = new Map<string, string[]>()
  for (const food of foods) {
    for (const allerg of food.allergs) {
      const allergIngreds = assocIngreds.get(allerg)
      assocIngreds.set(allerg, allergIngreds ? intersection(allergIngreds, food.ingreds) : food.ingreds)
    }
  }
  while (assocIngreds.size > 0) {
    const definites = [...assocIngreds.entries()].filter(([, ingreds]) => ingreds.length === 1)
    for (const [allerg, [ingred]] of definites) {
      ingredAllerg.set(ingred, allerg)
      assocIngreds.delete(allerg)
      for (const other of assocIngreds.keys()) {
        assocIngreds.set(other, without(assocIngreds.get(other), ingred))
      }
    }
  }
}

console.log(`Part 1: nonallergenic foods appear in ingredients lists ${foods.flatMap(f => f.ingreds).filter(i => !ingredAllerg.has(i)).length} times`)
console.log(`Part 2: canonical dangerous ingredients list ${[...ingredAllerg.keys()].sort((i0, i1) => ingredAllerg.get(i0)!.localeCompare(ingredAllerg.get(i1)!)).join()}`)
