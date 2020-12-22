import { loadInput } from '../util'

abstract class Rule {
  abstract match(s: string): string[]
}

class LiteralRule extends Rule {
  constructor(public token: string) {
    super()
  }

  match(s: string) {
    return s.startsWith(this.token) ? [s.slice(this.token.length)] : []
  }
}

const rules = new Map<number, Rule>()

class TreeRule extends Rule {
  constructor(public subs: number[][]) {
    super()
  }

  match(s: string) {
    return this.subs.flatMap(list => {
      let options = [s]
      for (const rule of list.map(n => rules.get(n)!)) {
        options = options.flatMap(partial => rule.match(partial))
      }
      return options
    })
  }
}

function loadRules(lines: string[]) {
  for (const line of lines) {
    const [, ruleNo, literal, tree] = line.match(/^(\d+): (?:"(.*)"|(\d+(?: \d+)*(?: \| \d+(?: \d+)*)*))$/)!
    rules.set(parseInt(ruleNo),
      literal !== undefined
        ? new LiteralRule(literal)
        : new TreeRule(tree.split(' | ').map(l => l.split(' ').map(n => parseInt(n))))
    )
  }
}

function doPart(part: number) {
  console.log(`Part ${part}: messages matching rule 0 ${msgs.filter(msg => rules.get(0)!.match(msg).includes('')).length}`)
}

const data = loadInput(__dirname)
const [rulesData, msgData] = data.split(/(?:\r?\n){2}/)
const msgs = msgData.split(/\r?\n/)
const rulesLines = rulesData.split(/\r?\n/)
console.log('Data loaded')

loadRules(rulesLines)
doPart(1)

loadRules(['8: 42 | 42 8', '11: 42 31 | 42 11 31'])
doPart(2)
