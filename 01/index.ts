import { range } from 'lodash'
import { loadInput } from '../util'

const data = loadInput(__dirname)
const lines = data.split(/\r?\n/)
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
    console.log(`Part 1: ${nums[l]} * ${nums[r]} = ${nums[l] * nums[r]}`)
    l++
    r--
  }
}

for (const i of range(nums.length - 2)) {
  for (const j of range(i + 1, nums.length - 1)) {
    for (const k of range(j + 1, nums.length)) {
      if (nums[i] + nums[j] + nums[k] === 2020) {
        console.log(`Part 2: ${nums[i]} * ${nums[j]} * ${nums[k]} = ${nums[i] * nums[j] * nums[k]}`)
      }
    }
  }
}
