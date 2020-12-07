import fs from 'fs'
import path from 'path'

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const entries = data.matchAll(/^(\d+)-(\d+) ([a-z]): ([a-z]+)$/gm)
console.log('Data loaded')

let correct1 = 0
let incorrect1 = 0
let correct2 = 0
let incorrect2 = 0
for (const entry of entries) {
  const n0 = parseInt(entry[1])
  const n1 = parseInt(entry[2])
  const char = entry[3]
  const pw = entry[4]

  let count = 0
  for (const c of pw) {
    if (c === char) {
      count++
    }
  }
  if (count < n0 || count > n1) {
    incorrect1++
  } else {
    correct1++
  }

  if ((pw[n0 - 1] === char) !== (pw[n1 - 1] === char)) {
    correct2++
  } else {
    incorrect2++
  }
}
console.log(`Part 1: ${correct1} correct, ${incorrect1} incorrect`)
console.log(`Part 2: ${correct2} correct, ${incorrect2} incorrect`)
