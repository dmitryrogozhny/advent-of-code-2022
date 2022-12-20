import { getData, getLines } from './utils'

// get data for the day and run both parts
getData(14).then((dayData) => {
  const data = getLines(dayData)

  const testData = getLines(`498,4 -> 498,6 -> 496,6
  503,4 -> 502,4 -> 502,9 -> 494,9`).map(s => s.trim()).filter(s => s.length !== 0)

  console.log(day14part1(testData))
  console.log(day14part1(data))

  console.log(day14part2(testData))
  console.log(day14part2(data))
}).catch(e => console.error(e))

enum Material {
  Air = 'air',
  Rock = 'rock',
  Sand = 'sand',
}

interface Point {
  x: number
  y: number
}

interface Line {
  from: Point
  to: Point
}

/**
 * Gets the map key from the point coordinates
 */
const key = ({ x, y }: Point): string => `${x},${y}`
/**
 * Gets the Point from the map key
 */
const toPoint = (pointStr: string): Point => {
  const [xStr, yStr] = pointStr.split(',')

  return { x: parseInt(xStr, 10), y: parseInt(yStr, 10) }
}

// https://adventofcode.com/2022/day/14
export function day14part1 (rocksData: string[]): number {
  const start = { x: 500, y: 0 }

  const caveMap = getCave(rocksData)
  let lowestPoint = 0

  // find the lowest point for rocks
  caveMap.forEach((_, key) => {
    const { y } = toPoint(key)

    if (y >= lowestPoint) {
      lowestPoint = y
    }
  })

  let sandPosition = { ...start }

  while (true) {
    // keep falling sand until all paths are blocked
    const newPosition = move(sandPosition, caveMap)

    // current sand unit cannot move, track a new one
    if (newPosition === undefined) {
      caveMap.set(key(sandPosition), Material.Sand)
      sandPosition = { ...start }
    } else {
      sandPosition = newPosition

      // if the sand unit is below the lowest rock, it'll fall indefinitely
      if (sandPosition.y > lowestPoint) {
        break
      }
    }
  }

  let sandUnits = 0

  caveMap.forEach((material, _) => {
    if (material === Material.Sand) {
      sandUnits++
    }
  })

  return sandUnits
}

// https://adventofcode.com/2022/day/14#part2
export function day14part2 (rocksData: string[]): number {
  const start = { x: 500, y: 0 }

  const caveMap = getCave(rocksData)
  let lowestPoint = 0

  // find the lowest point for rocks
  caveMap.forEach((_, key) => {
    const { y } = toPoint(key)

    if (y >= lowestPoint) {
      lowestPoint = y
    }
  })

  // add 2 to the lowest point to get the floor level
  lowestPoint += 2

  let sandPosition = { ...start }

  while (true) {
    // keep falling sand
    const newPosition = move(sandPosition, caveMap, lowestPoint)

    // current sand unit cannot move, track a new one
    if (newPosition === undefined) {
      caveMap.set(key(sandPosition), Material.Sand)

      // if the sand unit stuck at the starting point
      if (sandPosition.x === start.x && sandPosition.y === start.y) {
        break
      }

      sandPosition = { ...start }
    } else {
      sandPosition = newPosition
    }
  }

  let sandUnits = 0

  caveMap.forEach((material, _) => {
    if (material === Material.Sand) {
      sandUnits++
    }
  })

  return sandUnits
}

/**
 * Moves the sand unit
 * @param sandPosition The current sand unit position 
 * @param caveMap The map of the cave
 * @param floorLevel The floor level
 * @returns The new position for the sand unit. If it cannot move, returns undefined.
 */
function move (sandPosition: Point, caveMap: Map<string, Material>, floorLevel?: number): Point | undefined {
  // move down
  const stepDown = { x: sandPosition.x, y: sandPosition.y + 1 }
  if (!isOcupied(stepDown, caveMap, floorLevel)) {
    return stepDown
  }

  // move one step down and to the left
  const stepDownLeft = { x: sandPosition.x - 1, y: sandPosition.y + 1 }
  if (!isOcupied(stepDownLeft, caveMap, floorLevel)) {
    return stepDownLeft
  }

  // move one step down and to the right
  const stepDownRight = { x: sandPosition.x + 1, y: sandPosition.y + 1 }
  if (!isOcupied(stepDownRight, caveMap, floorLevel)) {
    return stepDownRight
  }

  // cannot move
  return undefined
}

/**
 * Defines whether the specified point is occupied by the rock or by another sand unit.
 */
function isOcupied (point: Point, caveMap: Map<string, Material>, floorLevel?: number): boolean {
  if (caveMap.has(key(point))) {
    return true
  }

  if (point.y === floorLevel) {
    return true
  }

  return false
}

/**
 * Parses the cave data into a map
 */
function getCave (rocksData: string[]): Map<string, Material> {
  const map = new Map<string, Material>()
  const lines: Line[] = []

  rocksData.forEach((rockPath) => {
    const segments = rockPath.split(' -> ')

    for (let i = 0; i < segments.length - 1; i++) {
      lines.push({
        from: toPoint(segments[i]),
        to: toPoint(segments[i + 1])
      })
    }
  })

  lines.forEach((line) => {
    const xFrom = Math.min(line.from.x, line.to.x)
    const xTo = Math.max(line.from.x, line.to.x)

    const yFrom = Math.min(line.from.y, line.to.y)
    const yTo = Math.max(line.from.y, line.to.y)

    for (let y = yFrom; y <= yTo; y++) {
      for (let x = xFrom; x <= xTo; x++) {
        const point = { x, y }

        map.set(key(point), Material.Rock)
      }
    }
  })

  return map
}
