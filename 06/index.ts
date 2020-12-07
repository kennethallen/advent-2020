import * as fs from 'fs'
import * as path from 'path'
import sum from 'lodash'

const data = fs.readFileSync(path.join(__dirname, 'input.txt')).slice(undefined, -1).toString()
const groups = data.split(/(?:\r?\n){2}/)
console.log('Data loaded')

const unionGroups = groups.map(s => new Set(s.match(/[a-z]/g)))
console.log(`Part 1: Total yesses (groups unioned) ${sum(unionGroups.map(g => g.size))}`)

const intersectGroups = groups.map(s => s.split(/\r?\n/).map(p => [...p]).reduce((a, b) => a.filter(q => b.includes(q))))
console.log(`Part 1: Total yesses (groups intersected) ${sum(intersectGroups.map(g => g.length))}`)
