import fs from 'fs'

const data = fs.readFileSync('01/input.txt').toString()
const lines = data.split(/\r?\n/)
const nums = lines.map(s => parseInt(s)).filter(i => !isNaN(i))
console.log('Data loaded')

nums.sort((a, b) => a - b)
console.log('Data sorted')

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
