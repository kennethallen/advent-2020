/* eslint-disable no-labels */
import { cloneDeep, last, range, rangeRight, times } from 'lodash'
import { loadInput, product, rotated, swap } from '../util'

class Image {
  // eslint-disable-next-line no-useless-constructor
  constructor(public imgData: boolean[][]) {}

  rotate(turns: number) {
    switch (turns % 4) {
      case 1:
        this.imgData = rangeRight(this.imgData[0].length).map(colIdx => range(this.imgData.length).map(rowIdx => this.imgData[rowIdx][colIdx]))
        break
      case 2:
        this.imgData.reverse()
        this.imgData.forEach(row => row.reverse())
        break
      case 3:
        this.imgData = range(this.imgData[0].length).map(colIdx => rangeRight(this.imgData.length).map(rowIdx => this.imgData[rowIdx][colIdx]))
    }
  }

  flipVert() {
    this.imgData.reverse()
  }

  flipHoriz() {
    this.imgData.forEach(row => row.reverse())
  }
}

class Tile extends Image {
  edgeKeys: number[]
  neighbors: (Tile | undefined)[] = times(4, () => undefined)

  constructor(public id: number, fullData: boolean[][]) {
    super(fullData.slice(1, -1).map(row => row.slice(1, -1)))
    this.edgeKeys = [
      fullData.map(s => last(s)!),
      fullData[0],
      fullData.map(s => s[0]),
      last(fullData)!,
    ].map(Tile.edgeKey)
  }

  rotate(turns: number) {
    super.rotate(turns)
    this.neighbors = rotated(this.neighbors, turns)
    this.edgeKeys = rotated(this.edgeKeys, turns)
  }

  flipVert() {
    super.flipVert()
    swap(this.neighbors, 1, 3)
    swap(this.edgeKeys, 1, 3)
  }

  flipHoriz() {
    super.flipHoriz()
    swap(this.neighbors, 0, 2)
    swap(this.edgeKeys, 0, 2)
  }

  outerEdgeCount() {
    return this.neighbors.filter(n => n === undefined).length
  }

  static edgeKey(e: boolean[]) {
    let n0 = 0
    let n1 = 0
    range(e.length).filter(i => e[i]).forEach(i => {
      n0 |= 1 << i
      n1 |= 1 << (e.length - 1 - i)
    })
    return Math.min(n0, n1)
  }
}

const [, data] = loadInput(__dirname).match(/^(.*?)\r?\n$/s)!
const tilesData = data.split(/(?:\r?\n){2}/)
const tiles = new Map<number, Tile>()
for (const tileData of tilesData) {
  const [, idStr, imgData] = tileData.match(/^Tile (\d+):\r?\n([.#]{10}(?:\r?\n[.#]{10}){9})$/)!
  const tile = new Tile(parseInt(idStr), imgData.split(/\r?\n/).map(row => [...row].map(c => c === '#')))

  tiles.set(tile.id, tile)
}
console.log('Data loaded')

{
  const edgeRegistry = new Map<number, Tile | null>()
  for (const tile of tiles.values()) {
    for (const [index, edgeKey] of tile.edgeKeys.entries()) {
      const other = edgeRegistry.get(edgeKey)
      if (other === null) {
        throw Error('Edge found not in unique pair')
      } else if (other === undefined) {
        edgeRegistry.set(edgeKey, tile)
        // console.log('First edge with key', edgeKey, 'id', tile.id, 'edge', ['right', 'top', 'left', 'bottom'][index])
      } else {
        tile.neighbors[index] = other
        other.neighbors[other.edgeKeys.indexOf(edgeKey)] = tile
        edgeRegistry.set(edgeKey, null)
        // console.log('Pairing key', edgeKey, 'to id', other.id, 'edge', ['right', 'top', 'left', 'bottom'][other.edgeKeys().indexOf(edgeKey)])
      }
    }
  }
}

const corners = [...tiles.values()].filter(t => t.outerEdgeCount() === 2)
console.log('Part 1: tiles with two outer edges', corners.map(t => t.id), product(corners.map(t => t.id)))

function pickTile(above: Tile | undefined, left: Tile | undefined) {
  let tile: Tile | undefined
  if (above === undefined) {
    if (left === undefined) { // Top-left corner
      tile = corners[0]
      while (tile.neighbors[2] !== undefined || tile.neighbors[1] !== undefined) {
        tile.rotate(1)
      }
    } else { // Top edge
      tile = left.neighbors[0]
      if (tile) {
        tile.rotate((6 - tile.neighbors.indexOf(left)) % 4)
        if (tile.neighbors[1] !== above) {
          tile.flipVert()
        }
      }
    }
  } else {
    tile = above.neighbors[3]
    if (tile) {
      tile.rotate((5 - tile.neighbors.indexOf(above)) % 4)
      if (tile.neighbors[2] !== left) {
        tile.flipHoriz()
      }
    }
  }
  return tile
}

const tileGrid: Tile[][] = []
while (true) {
  const row = []
  while (true) {
    const next = pickTile(last(tileGrid)?.[row.length], last(row))
    if (next === undefined) {
      break
    }
    row.push(next)
  }
  if (!row.length) {
    break
  }
  tileGrid.push(row)
}

const monster = '                  # ,#    ##    ##    ###, #  #  #  #  #  #   '.split(',').map(row => [...row].map(c => c === '#'))
function filterMonsters(imgData: boolean[][]) {
  let count = 0
  for (const x of range(imgData.length - monster.length + 1)) {
    for (const y of range(imgData[0].length - monster[0].length + 1)) {
      testPosition: {
        for (const mx of range(monster.length)) {
          for (const my of range(monster[0].length)) {
            if (monster[mx][my] && !imgData[x + mx][y + my]) {
              break testPosition
            }
          }
        }
        count++
        // console.log(`Monster at (${x},${y}):`)
        // imgData.slice(x, x + monster.length).forEach(row => console.log(row.slice(y, y + monster[0].length).map(b => b ? '#' : '.').join('')))
        for (const mx of range(monster.length)) {
          for (const my of range(monster[0].length)) {
            if (monster[mx][my]) {
              imgData[x + mx][y + my] = false
            }
          }
        }
      }
    }
  }
  return { count, roughness: imgData.flat().filter(b => b).length }
}

const fullImg = new Image(tileGrid.flatMap(tileRow => tileRow[0].imgData.map((_, imgRow) => tileRow.flatMap(tile => tile.imgData[imgRow]))))
for (const rotation of range(4)) {
  function test(flipped: boolean) {
    const { count, roughness } = filterMonsters(cloneDeep(fullImg.imgData))
    if (count > 0) {
      console.log(`Part 2: ${count} monsters found rotation ${rotation} ${flipped ? '' : 'un'}flipped, roughness ${roughness}`)
    }
  }
  test(false)

  fullImg.flipVert()
  test(true)

  fullImg.flipVert()
  fullImg.rotate(1)
}
