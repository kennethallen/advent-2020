import { loadInput } from '../util'

const InitialBase = 7
const Prime = 20201227

function modExp(base: number, exp: number) {
  let val = 1
  while (exp-- > 0) {
    val = (val * base) % Prime
  }
  return val
}
function discreteLog(base: number, target: number) {
  let exp = 0
  for (let val = 1; val !== target; exp++) {
    val = (val * base) % Prime
  }
  return exp
}

const data = loadInput(__dirname)
const pubKeys = data.split(/\r?\n/).map(s => parseInt(s))
console.log('Data loaded')

console.log('Part 1: exchanged secret is', modExp(pubKeys[0], discreteLog(InitialBase, pubKeys[1])))
