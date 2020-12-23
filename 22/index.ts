import { cloneDeep, max, maxBy, range, sum } from 'lodash'
import { loadInput } from '../util'

const data = loadInput(__dirname)
const initDecks = data.split(/(?:\r?\n){2}/).map(d => d.match(/^Player \d+:\r?\n(.*)$/s)![1].split(/\r?\n/).map(s => parseInt(s)))
console.log('Data loaded')

function scoreDeck(d: number[]) {
  return sum(d.map((card, i) => card * (d.length - i)))
}

{
  const decks = cloneDeep(initDecks)
  while (decks.every(d => d.length > 0)) {
    const round: number[] = []
    decks.forEach(d => round.push(d.shift()!))
    decks[maxBy(range(decks.length), i => round[i])!].push(...round.sort((a, b) => b - a))
  }
  console.log('Part 1: winning score', max(decks.map(scoreDeck)))
}

function recursiveCombat(decks: number[][]) {
  const states = new Set<string>()
  while (decks.every(d => d.length > 0)) {
    {
      const state = JSON.stringify(decks)
      if (states.has(state)) {
        return { winner: 0, decks }
      }
      states.add(state)
    }

    const round: number[] = []
    decks.forEach(d => round.push(d.shift()!))

    let winner: number
    if (decks.every((d, i) => d.length >= round[i])) {
      winner = recursiveCombat(decks.map((d, i) => d.slice(0, round[i]))).winner
    } else {
      winner = maxBy(range(decks.length), i => round[i])!
    }
    decks[winner].push(...round.splice(winner, 1), ...round)
  }
  return { winner: maxBy(range(decks.length), i => decks[i].length)!, decks }
}
console.log('Part 2: winning score', max(recursiveCombat(cloneDeep(initDecks)).decks.map(scoreDeck)))
