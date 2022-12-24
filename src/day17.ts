import { getData, getLines } from './utils'

// get data for the day and run both parts
getData(17).then((dayData) => {
  const data = getLines(dayData)

  const testData = '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>'

  console.log(day17part1(testData, possibleRockTypes))
  console.log(day17part1(data[0], possibleRockTypes))

//   console.log(day17part2(testData))
//   console.log(day17part2(data[0], possibleRockTypes))
}).catch(e => console.error(e))

// ####
const minusShape = [
  [0, 0], [0, 1], [0, 2], [0, 3]
]

// .#.
// ###
// .#.
const crossShape = [
  [2, 1],
  [1, 0], [1, 1], [1, 2],
  [0, 1]
]

// ..#
// ..#
// ###
const angleShape = [
  [2, 2],
  [1, 2],
  [0, 0], [0, 1], [0, 2]
]

// #
// #
// #
// #
const lShape = [
  [3, 0],
  [2, 0],
  [1, 0],
  [0, 0]
]

// ##
// ##
const squareShape = [
  [1, 0], [1, 1],
  [0, 0], [0, 1]
]

const possibleRockTypes = [minusShape, crossShape, angleShape, lShape, squareShape]

/**
 * Describes the rock shape as a numbers array
 */
type RockType = number[][]

interface Point {
  x: number
  y: number
}

const key = (point: Point): string => `${point.y}_${point.x}`
const toPoint = (key: string): Point => {
  const [y, x] = key.split('_').map((s) => parseInt(s, 10))
  return { x, y }
}

enum Material {
  floor = 'floor',
  rock = 'rock',
}

/**
 * Describes the rock as a map with all its points coordinates
 */
type Rock = Map<string, Material>
/**
 * Describes the chamber as a map with all its points coordinates
 */
type Chamber = Map<string, Material>

// https://adventofcode.com/2022/day/17
export function day17part1 (moves: string, rockTypes: RockType[]): number {
  // return run(moves, rockTypes, 2022);
  return run(moves, rockTypes, 10_000)
}

// https://adventofcode.com/2022/day/17#part2
export function day17part2 (moves: string, rockTypes: RockType[]): number {
  return run(moves, rockTypes, 1_000_000_000_000)
}

/**
 * Runs the rock falling simulation
 * @param moves List of gas moves
 * @param rockTypes List of rock shapes
 * @param rocksLimit Amount of rocks to simulate
 * @returns The height of the rocks
 */
export function run (moves: string, rockTypes: RockType[], rocksLimit: number): number {
  const width = 7
  const chamber = initChamber(Material.floor, width)

  let cycle = 0
  let rocksCount = 0
  let startingPoint = getStartingPoint(chamber)
  let rockType = rockTypes[rocksCount % rockTypes.length]
  let rock = initRock(rockType, startingPoint)

  while (rocksCount < rocksLimit) {
    const move = moves[cycle % moves.length]

    const { rock: rockMovedHorizontally } = moveHorizontally(move, rock, chamber, width)
    rock = rockMovedHorizontally

    // move current rock down
    const { rock: rockMovedDown, moved: movedDown } = moveDown(rock, chamber)

    // if current rock has landed, generate new rock
    if (!movedDown) {
      // add rock points to chamber
      rock.forEach((material, position) => {
        chamber.set(position, material)
      })

      // generate new rock
      rocksCount++
      startingPoint = getStartingPoint(chamber)
      rockType = rockTypes[rocksCount % rockTypes.length]
      rock = initRock(rockType, startingPoint)
    } else {
      rock = rockMovedDown
    }

    cycle++
  }

  let maxHeight = -1

  chamber.forEach((_, position) => {
    const { y } = toPoint(position)

    if (y > maxHeight) {
      maxHeight = y
    }
  })

  return maxHeight
}

/**
 * Creates new map for the chamber with the floor of the specified width
 * @param floorMaterial Material for the floor
 * @param width Maximum width of the chamber
 * @returns The map for the new chamber
 */
function initChamber (floorMaterial: Material, width: number): Chamber {
  const chamber = new Map<string, Material>()

  for (let i = 0; i < width; i++) {
    chamber.set(key({ x: i, y: 0 }), floorMaterial)
  }

  return chamber
}

/**
 * Calculates the initial position for new rock
 * @param chamber Current chamber
 * @returns The initial position for new rock
 */
function getStartingPoint (chamber: Chamber): Point {
  let maxHeight = 0

  chamber.forEach((_, key) => {
    const { y } = toPoint(key)

    if (y > maxHeight) {
      maxHeight = y
    }
  })

  return { x: 2, y: maxHeight + 4 }
}

/**
 * Creates a new rock of the specified type at the specified position
 * @param rockType The shape of rock
 * @param startingPoint The starting point
 * @returns The new rock
 */
function initRock (rockType: RockType, startingPoint: Point): Rock {
  const rock = new Map<string, Material>()

  rockType.forEach(([y, x]) => {
    const rockElement = { x: startingPoint.x + x, y: startingPoint.y + y }
    rock.set(key(rockElement), Material.rock)
  })

  return rock
}

/**
 * Moves the specified rock one position horizontally.
 * If it's impossible to move the rock because of other rocks or bounds, the rock stays at the same position.
 * @param moveType Whether to move left < or right >
 * @param rock The rock to move
 * @param chamber The chamber
 * @param maxWidth The maximum width of the chamber
 * @returns Returns the position of the rock and whether it has been moved
 */
function moveHorizontally (moveType: string, rock: Rock, chamber: Chamber, maxWidth: number): { rock: Rock, moved: boolean } {
  const moveLeft = -1
  const moveRight = 1

  const move = moveType === '>' ? moveRight : moveLeft

  let moved = true

  const movedRock = new Map<string, Material>()

  rock.forEach((material, position) => {
    const point = toPoint(position)
    const newPoint = { x: point.x + move, y: point.y }

    // check for out of bounds
    if (newPoint.x < 0 || newPoint.x >= maxWidth) {
      moved = false
    }

    // check for collision with other rocks
    if (chamber.has(key(newPoint))) {
      moved = false
    }

    movedRock.set(key(newPoint), material)
  })

  return { rock: moved ? movedRock : rock, moved }
}

/**
 * If possible, moves the rock one step down
 * @param rock The rock
 * @param chamber The chamber
 * @returns Returns the position of the rock and whether it has been moved
 */
function moveDown (rock: Rock, chamber: Chamber): { rock: Rock, moved: boolean } {
  const moveDown = -1
  let moved = true

  const movedRock = new Map<string, Material>()

  rock.forEach((material, position) => {
    const point = toPoint(position)
    const newPoint = { x: point.x, y: point.y + moveDown }

    // check for out of bounds
    if (newPoint.y <= 0) {
      moved = false
    }

    // check for collision with other rocks
    if (chamber.has(key(newPoint))) {
      moved = false
    }

    movedRock.set(key(newPoint), material)
  })

  return { rock: moved ? movedRock : rock, moved }
}

/**
 * Prints out the chamber to console
 * @param chamber The chamber
 */
function _print (chamber: Chamber): void {
  let maxWidth = -1
  let maxHeight = -1

  chamber.forEach((_, key) => {
    const { x, y } = toPoint(key)

    maxWidth = Math.max(maxWidth, x)
    maxHeight = Math.max(maxHeight, y)
  })

  for (let y = maxHeight; y >= 0; y--) {
    let row = '|'

    for (let x = 0; x < 7; x++) {
      const position = { x, y }

      const material = chamber.get(key(position))
      if (material !== undefined) {
        row += material === Material.floor ? '_' : '#'
      } else {
        row += '.'
      }
    }

    row += '|'
    console.log(row)
  }
}
