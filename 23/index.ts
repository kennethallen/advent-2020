import { first, last, maxBy, minBy, tail, times } from 'lodash'
import { loadInput, product } from '../util'

const data = loadInput(__dirname)
const initCups = [...data].map(s => parseInt(s))
console.log('Data loaded')

interface Cup {
  label: number
  clockwise?: Cup
  nextLabel?: Cup
}

function playLinked(labels: number[], extras: number, iters: number) {
  let minLabelCup: Cup
  let currentCup: Cup
  {
    const cups: Cup[] = labels.map(label => ({ label }))
    currentCup = first(cups)!
    minLabelCup = minBy(cups, cup => cup.label)!
    let maxLabelCup = maxBy(cups, cup => cup.label)!
    for (const [i, cup] of cups.entries()) {
      cup.clockwise = cups[(i + 1) % cups.length]
      cup.nextLabel = cup === minLabelCup ? maxLabelCup : cups[labels.indexOf(cup.label - 1)]
    }

    let cursor = last(cups)!
    times(extras, () => {
      const cup = {
        label: maxLabelCup.label + 1,
        clockwise: cursor.clockwise,
        nextLabel: maxLabelCup,
      }
      cursor.clockwise = cup
      minLabelCup.nextLabel = cup
      cursor = cup
      maxLabelCup = cup
    })
  }

  times(iters, () => {
    const pickup = []
    for (let cursor = currentCup; pickup.length < 3; cursor = cursor.clockwise!) {
      pickup.push(cursor.clockwise!)
    }
    currentCup.clockwise = last(pickup)!.clockwise

    let destCup = currentCup
    do {
      destCup = destCup.nextLabel!
    } while (pickup.includes(destCup))
    last(pickup)!.clockwise = destCup.clockwise
    destCup.clockwise = first(pickup)!

    currentCup = currentCup.clockwise!
  })
  return minLabelCup
}

{
  const oneCup = playLinked(initCups, 0, 100)
  const cups = [oneCup]
  while (last(cups)!.clockwise! !== oneCup) {
    cups.push(last(cups)!.clockwise!)
  }
  console.log('Part 1: labels after 1', tail(cups).map(c => c.label).join(''))
}
{
  const oneCup = playLinked(initCups, 1_000_000 - initCups.length, 10_000_000)
  const starCupLabels = [oneCup.clockwise!, oneCup.clockwise!.clockwise!].map(c => c.label)
  console.log('Part 2: two labels after 1', starCupLabels, 'product', product(starCupLabels))
}
