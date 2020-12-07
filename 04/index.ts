import * as fs from 'fs'
import * as path from 'path'

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const passports = data.split(/(?:\r?\n){2}/).map(s => {
  const map = new Map<string, string>()
  for (const entry of s.split(/\r?\n| /)) {
    const [field, value] = entry.split(':')
    map.set(field, value)
  }
  return map
})
console.log('Data loaded')

const validators = new Map<string, (val: string) => boolean>()
function r (l: number, h: number) {
  return (v: string) => {
    const n = parseInt(v)
    return !isNaN(n) && n >= l && n <= h
  }
}
validators.set('byr', r(1920, 2002))
validators.set('iyr', r(2010, 2020))
validators.set('eyr', r(2020, 2030))
validators.set('hgt', v => {
  const n = v.slice(undefined, -2)
  const unit = v.slice(-2)
  return (unit === 'cm' && r(150, 193)(n)) || (unit === 'in' && r(59, 76)(n))
})
validators.set('hcl', v => /^#[\da-f]{6}$/.test(v))
validators.set('ecl', v => /^amb|blu|brn|gry|grn|hzl|oth$/.test(v))
validators.set('pid', v => /^\d{9}$/.test(v))

let valid1 = 0
let valid2 = 0
for (const passport of passports) {
  if ([...validators.keys()].every(f => passport.has(f))) {
    valid1++
  }

  if ([...validators.entries()].every(([field, validator]) => {
    const value = passport.get(field)
    return value && validator(value)
  })) {
    valid2++
  }
}
console.log(`Part 1: ${valid1} valid passports out of ${passports.length}`)
console.log(`Part 2: ${valid2} valid passports out of ${passports.length}`)
