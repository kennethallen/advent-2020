import * as fs from 'fs'
import * as path from 'path'

interface Instruction {
  op: string
  arg: number
}

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const code: Instruction[] = data.split(/\r?\n/).map(s => {
  const [, op, arg] = s.match(/^(nop|acc|jmp) ([+-]\d+)$/)!
  return { op, arg: parseInt(arg) }
})
console.log('Data loaded')

function emulate() {
  const passed = new Set<number>()
  let line = 0
  let acc = 0
  while (!passed.has(line) && line >= 0 && line < code.length) {
    passed.add(line)
    switch (code[line].op) {
      case 'jmp':
        line += code[line].arg
        break
      case 'acc':
        acc += code[line].arg
      // eslint-disable-next-line no-fallthrough
      case 'nop':
        line++
        break
    }
  }
  return { line, acc }
}

{
  const { line, acc } = emulate()
  console.log(`Part 1: instruction #${line} repeated, acc=${acc}`)
}

for (let i = 0; i < code.length; i++) {
  if (code[i].op !== 'acc') {
    code[i].op = code[i].op === 'nop' ? 'jmp' : 'nop'

    const { line, acc } = emulate()
    if (line === code.length) {
      console.log(`Part 2: instruction #${line} flipped and program exited, acc=${acc}`)
    }

    code[i].op = code[i].op === 'nop' ? 'jmp' : 'nop'
  }
}
