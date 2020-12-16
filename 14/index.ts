import * as fs from 'fs'
import { sum } from 'lodash'
import * as path from 'path'

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const lines = data.split(/\r?\n/)
console.log('Data loaded')

function decodeLine(line: string) {
  const [, mask, addr, val] = line.match(/mask = ([10X]{36})|mem\[(\d+)\] = (\d+)/)!
  return { mask, addr, val }
}

{
  const mem = new Map<number, bigint>()
  let maskOn = BigInt(0)
  let maskOff = (BigInt(1) << BigInt(36)) - BigInt(1) // 36 1s
  for (const line of lines) {
    const { mask, addr, val } = decodeLine(line)
    if (mask) {
      maskOn = BigInt(0)
      maskOff = BigInt(0)
      for (let i = 0; i < mask.length; i++) {
        if (mask[i] === '1') {
          maskOn |= BigInt(1) << BigInt(36 - 1 - i)
        } else if (mask[i] === '0') {
          maskOff |= BigInt(1) << BigInt(36 - 1 - i)
        }
      }
      maskOff ^= (BigInt(1) << BigInt(36)) - BigInt(1) // 36 1s
    } else {
      mem.set(parseInt(addr), (BigInt(val) | maskOn) & maskOff)
    }
  }
  console.log(`Part 1: sum of memory values ${sum([...mem.values()])}`)
}

{
  const mem = new Map<bigint, number>()
  let maskOn = BigInt(0)
  let fluxMasks: bigint[] = []
  for (const line of lines) {
    const { mask, addr, val } = decodeLine(line)
    if (mask) {
      maskOn = BigInt(0)
      fluxMasks = []
      for (let i = 0; i < mask.length; i++) {
        if (mask[i] === '1') {
          maskOn |= BigInt(1) << BigInt(36 - 1 - i)
        } else if (mask[i] === 'X') {
          fluxMasks.push(BigInt(1) << BigInt(36 - 1 - i))
        }
      }
    } else {
      function flux(i: number, addr: bigint, val: number) {
        if (i === fluxMasks.length) {
          mem.set(addr, val)
        } else {
          flux(i + 1, addr, val)
          flux(i + 1, addr ^ fluxMasks[i], val)
        }
      }
      flux(0, BigInt(addr) | maskOn, parseInt(val))
    }
  }
  console.log(`Part 2: sum of memory values ${sum([...mem.values()])}`)
}
