import * as fs from 'fs'
import { sum } from 'lodash'
import * as path from 'path'
const { Parser } = require('jison')

const [, data] = fs.readFileSync(path.join(__dirname, 'input.txt')).toString().match(/^(.*?)\r?\n$/s)!
const lines = data.split(/\r?\n/)
console.log('Data loaded')

const lex = {
  rules: [
    ['\\s+', '/* skip whitespace */'],
    ['\\d+', 'return \'number\';'],
    ['\\*', 'return \'*\';'],
    ['\\+', 'return \'+\';'],
    ['\\(', 'return \'(\';'],
    ['\\)', 'return \')\';'],
  ]
}

{
  const parser = new Parser({
    lex,
    bnf: {
      line: [['expr', 'return $1']],
      expr: [
        ['expr + scalar', '$$ = $1 + $3'],
        ['expr * scalar', '$$ = $1 * $3'],
        ['scalar', '$$ = $1'],
      ],
      scalar: [
        ['( expr )', '$$ = $2'],
        ['number', '$$ = Number($1)'],
      ],
    },
  })
  console.log(`Part 1: sum ${sum(lines.map(l => parser.parse(l)))}`)
}

{
  const parser = new Parser({
    lex,
    operators: [['left', '*'], ['left', '+']],
    bnf: {
      line: [['expr', 'return $1']],
      expr: [
        ['expr + expr', '$$ = $1 + $3'],
        ['expr * expr', '$$ = $1 * $3'],
        ['( expr )', '$$ = $2'],
        ['number', '$$ = Number($1)'],
      ],
    },
  })
  console.log(`Part 2: sum ${sum(lines.map(l => parser.parse(l)))}`)
}
