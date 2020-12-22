import { loadInput } from '../util'

interface Instruction {
  code: string
  value: number
}

function toRadians(deg: number) {
  return deg * Math.PI / 180
}

const data = loadInput(__dirname)
const insts: Instruction[] = data.split(/\r?\n/).map(s => {
  const [, code, value] = s.match(/^([NSEWLRF])(\d+)$/)!
  return { code, value: parseInt(value) }
})
console.log('Data loaded')

{
  let face = 0
  let x = 0
  let y = 0
  for (const { code, value } of insts) {
    switch (code) {
      case 'N': y += value; break
      case 'S': y -= value; break
      case 'E': x += value; break
      case 'W': x -= value; break
      case 'L': face += value; break
      case 'R': face -= value; break
      case 'F':
        x += value * Math.cos(face * Math.PI / 180)
        y += value * Math.sin(face * Math.PI / 180)
    }
  }
  console.log(`Part 1: ‖(${x}, ${y})‖ = ${Math.abs(x) + Math.abs(y)}`)
}

{
  let x = 0
  let y = 0
  let wx = 10
  let wy = 1
  for (let { code, value } of insts) {
    switch (code) {
      case 'N': wy += value; break
      case 'S': wy -= value; break
      case 'E': wx += value; break
      case 'W': wx -= value; break
      case 'R':
        value = -value
      // eslint-disable-next-line no-fallthrough
      case 'L':
        {
          const cos = Math.cos(toRadians(value))
          const sin = Math.sin(toRadians(value))
          const nwx = wx * cos - wy * sin
          wy = wx * sin + wy * cos
          wx = nwx
        }
        break
      case 'F':
        x += value * wx
        y += value * wy
    }
  }
  console.log(`Part 2: ‖(${x}, ${y})‖ = ${Math.abs(x) + Math.abs(y)}`)
}
