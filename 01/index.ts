import fs from 'fs'
import path from 'path'

const data = fs.readFileSync(path.join(__dirname, 'input.txt')).toString()
const lines = data.split(/\r?\n/)
if (lines[lines.length - 1] === '') {
  lines.splice(lines.length - 1)
}
const nums = lines.map(s => parseInt(s))
console.log('Data loaded')

nums.sort((a, b) => a - b)
console.log('Data sorted')

for (let i = 1; i < nums.length;) {
  if (nums[i] === nums[i - 1]) {
    let count = 1
    while (nums[i] + count === nums[i - 1]) {
      count++
    }
    nums.splice(i, count)
  } else {
    i++
  }
}
console.log('Duplicates removed')

for (let l = 0, r = nums.length - 1; l < r;) {
  const sum = nums[l] + nums[r]
  if (sum < 2020) {
    l++
  } else if (sum > 2020) {
    r--
  } else {
    console.log(`${nums[l]} * ${nums[r]} = ${nums[l] * nums[r]}`)
    l++
    r--
  }
}
console.log('Part 1 complete')

for (let i = 0; i < nums.length - 2; i++) {
  for (let j = i + 1; j < nums.length - 1; j++) {
    for (let k = j + 1; k < nums.length; k++) {
      const sum = nums[i] + nums[j] + nums[k]
      if (sum === 2020) {
        console.log(`${nums[i]} * ${nums[j]} * ${nums[k]} = ${nums[i] * nums[j] * nums[k]}`)
      }
    }
  }
}
console.log('Part 2 complete')
