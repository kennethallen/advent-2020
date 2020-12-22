import { sum, intersection } from 'lodash'
import { loadInput } from '../util'

const data = loadInput(__dirname)
const groups = data.split(/(?:\r?\n){2}/)
console.log('Data loaded')

console.log('Part 1: Total yesses (groups unioned)', sum(groups.map(s => new Set(s.match(/[a-z]/g))).map(g => g.size)))
console.log('Part 2: Total yesses (groups intersected)', sum(groups.map(s => intersection(...s.split(/\r?\n/).map(p => [...p]))).map(g => g.length)))
