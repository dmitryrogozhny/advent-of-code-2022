import { getData, getGrid } from './utils'

// get data for the day and run both parts
getData(12).then((dayData) => {
  const data = getGrid(dayData)

  const testDayData = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`
  const testData = getGrid(testDayData)

  console.log(day12part1(testData))
  console.log(day12part1(data))

  console.log(day12part2(testData))
  console.log(day12part2(data))
}).catch(e => console.error(e))

interface Position {
  x: number
  y: number
}

interface PositionWithDistance extends Position {
  distance: number
}

// https://adventofcode.com/2022/day/12
export function day12part1 (map: string[][]): number {
  const startPosition = findPosition('S', map)
  const finishPosition = findPosition('E', map)

  return findDistance(startPosition, finishPosition, map)
}

// https://adventofcode.com/2022/day/12#part2
export function day12part2 (map: string[][]): number {
  const finishPosition = findPosition('E', map)
  const startPositions: Position[] = []

  // find all possible starting positions
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const height = map[y][x]

      if (height === 'a' || height === 'S') {
        startPositions.push({ x, y })
      }
    }
  }

  // calculate distances
  const distances = startPositions.map((startPosition) => findDistance(startPosition, finishPosition, map))

  return distances.filter((d) => d !== -1).sort((a, b) => a - b)[0]
}

/**
 * Finds the position of the specified character
 * @param mark The character to search for
 * @param map The location map
 * @returns The position of the specified character.
 */
function findPosition (mark: string, map: string[][]): Position {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === mark) {
        return { x, y }
      }
    }
  }

  throw new Error(`Mark ${mark} not found in the map`)
}

// Use x_y as a key
const key: (postion: Position) => string = (position: { x: number, y: number }) => `${position.x}_${position.y}`

/**
 * Finds the minimal distance between the specified points using the BFS (breadth-first search)
 * @param start The start position
 * @param finish The finish position
 * @param map The location map
 * @returns The minimal distance between the start and the finish
 */
function findDistance (start: Position, finish: Position, map: string[][]): number {
  const directions = [
    [0, 1], // up
    [0, -1], // down
    [1, 0], // right
    [-1, 0] // left
  ]

  const visited = new Map<string, number>()
  // additional map that allows to avoid adding the same location to the queue multiple times
  const queueMap = new Map<string, boolean>()

  const queue: PositionWithDistance[] = []

  const startPoint = { x: start.x, y: start.y, distance: 0 }
  queue.push(startPoint)

  queueMap.set(`${startPoint.x}_${startPoint.y}_${startPoint.distance}`, true)

  visited.set(key(startPoint), startPoint.distance)

  while (queue.length !== 0) {
    const point = queue.shift()

    if (point === undefined) {
      return -1
    }

    // found the target point
    if (point.x === finish.x && point.y === finish.y) {
      return point.distance
    }

    visited.set(key(point), point.distance)

    // try to move up, down, left, and right
    for (let i = 0; i < directions.length; i++) {
      const [x, y] = directions[i]
      const newPoint = { x: point.x + x, y: point.y + y, distance: point.distance + 1 }

      // if the point is not already in the queue
      if (!queueMap.has(`${newPoint.x}_${newPoint.y}_${newPoint.distance}`)) {
        // if the point has not been visited yet
        if (!visited.has(key(newPoint))) {
          // if it's possible to navigate to that point
          if (canGoTo(point, newPoint, map)) {
            // add the point to the queue
            queue.push(newPoint)
            // add point to the map to optimize the queue
            queueMap.set(`${newPoint.x}_${newPoint.y}_${newPoint.distance}`, true)
          }
        }
      }
    }
  }

  return -1
}

/**
 * Defines whether it's possible to navigate between two points
 * @param from The from point.
 * @param to The to point.
 * @param map Map of a location.
 * @returns Whether it's possible to navigate.
 */
function canGoTo (from: { x: number, y: number }, to: { x: number, y: number }, map: string[][]): boolean {
  // check for out of bounds
  if (to.x < 0 || to.x >= map[0].length) {
    return false
  }

  if (to.y < 0 || to.y >= map.length) {
    return false
  }

  // get heights of two points. Treat the starting point as of height a, treat the finish poins as of height z
  const fromHeight = map[from.y][from.x] === 'S' ? 'a'.charCodeAt(0) : map[from.y][from.x].charCodeAt(0)
  const toHeight = map[to.y][to.x] === 'E' ? 'z'.charCodeAt(0) : map[to.y][to.x].charCodeAt(0)

  const difference = toHeight - fromHeight

  if (difference <= 1) {
    return true
  } else {
    return false
  }
}
