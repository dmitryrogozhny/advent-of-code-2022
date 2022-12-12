import { getData, getLines } from './utils'

// get data for the day and run both parts
getData(9).then((dayData) => {
  const testDayData = `R 4
  U 4
  L 3
  D 1
  R 4
  D 1
  L 5
  R 2`

  const testData2 = getLines(`R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`).map((s) => s.trim())

  const testData = getLines(testDayData).map((s) => s.trim())

  const data = getLines(dayData)

  console.log(day9part1(testData))
  console.log(day9part1(data))

  console.log(day9part2(testData))
  console.log(day9part2(testData2))
  console.log(day9part2(data))
}).catch(e => console.error(e))

interface Position {
  x: number
  y: number
}

type Direction = 'U' | 'D' | 'L' | 'R'

interface Move {
  direction: Direction
  steps: number
}

// https://adventofcode.com/2022/day/9
function day9part1 (movesData: string[]): number {
  const moves = movesData.map(parseMove)
  const pointsVisited = new Map<string, Position>()

  const initialPosition = { x: 0, y: 0 }

  let headPosiiton = initialPosition
  let tailPosition = initialPosition

  moves.forEach(({ direction, steps }) => {
    for (let i = 0; i < steps; i++) {
      headPosiiton = moveHead(headPosiiton, direction)
      tailPosition = moveTail(headPosiiton, tailPosition)

      pointsVisited.set(`${tailPosition.x}_${tailPosition.y}`, tailPosition)
    }
  })

  return pointsVisited.size
}

// https://adventofcode.com/2022/day/9#part2
function day9part2 (movesData: string[]): number {
  const knotsAmount = 10
  const moves = movesData.map(parseMove)
  const pointsVisited = new Map<string, Position>()

  const initialPosition = { x: 0, y: 0 }

  const knots: Position[] = Array(knotsAmount).fill({ x: initialPosition.x, y: initialPosition.y })

  // for every move
  moves.forEach(({ direction, steps }) => {
    // for every step in the move
    for (let i = 0; i < steps; i++) {
      // for every knot on the rope
      for (let k = 0; k < knots.length; k++) {
        const knotPosition = knots[k]
        // move the first knot as the head
        if (k === 0) {
          const newPosition = moveHead(knotPosition, direction)
          knots[k] = newPosition
        } else {
          // move the rest of knots as the tail
          const previousKnot = knots[k - 1]
          const newPosition = moveTail(previousKnot, knotPosition)
          knots[k] = newPosition
        }
      }

      pointsVisited.set(`${knots[knots.length - 1].x}_${knots[knots.length - 1].y}`, knots[knots.length - 1])
    }
  })

  return pointsVisited.size
}

/**
 * Parses the string with the move description into the Move object
 * @param moveStr String describing the move, e.g. U 8 or L 2
 * @returns The parsed Position
 */
function parseMove (moveStr: string): Move {
  const [direction, stepsStr] = moveStr.split(' ')
  return { direction: direction as Direction, steps: parseInt(stepsStr, 10) }
}

/**
 * Moves the head one step into the specified direction.
 * @param headPosiiton Current head position
 * @param direction Direction to move
 * @returns New head position
 */
function moveHead ({ x, y }: Position, direction: Direction): Position {
  switch (direction) {
    case 'U':
      return { x, y: y + 1 }
    case 'D':
      return { x, y: y - 1 }
    case 'L':
      return { x: x - 1, y }
    case 'R':
      return { x: x + 1, y }
  }
}

/**
 * Moves the tail depending on the current positions of the head and the tail.
 * @param headPosiiton Current head position
 * @param tailPosition Current tail position
 * @returns New tail position
 */
function moveTail (headPosiiton: Position, tailPosition: Position): Position {
  const { x: headX, y: headY } = headPosiiton
  const { x: tailX, y: tailY } = tailPosition

  let newTailX = tailX
  let newTailY = tailY

  const xDistance = Math.abs(headX - tailX)
  const yDistance = Math.abs(headY - tailY)

  // move tail only if it's 2 steps away from the head
  if (xDistance === 2 || yDistance === 2) {
    // If the head is ever two steps directly up, down, left, or right from the tail,
    // the tail must also move one step in that direction
    if ((xDistance === 2) && (headY === tailY)) {
      if (headX > tailX) {
        newTailX++
      } else {
        newTailX--
      }
    } else if ((yDistance === 2) && (headX === tailX)) {
      if (headY > tailY) {
        newTailY++
      } else {
        newTailY--
      }
    } else if ((headX !== tailX) && (headY !== tailY)) {
      // Otherwise, if the head and tail aren't touching and aren't in the same row or column,
      // the tail always moves one step diagonally to keep up

      // move X
      if (headX > tailX) {
        newTailX++
      } else {
        newTailX--
      }

      // move Y
      if (headY > tailY) {
        newTailY++
      } else {
        newTailY--
      }
    } else {
      throw new Error('Unknown state')
    }
  }

  return { x: newTailX, y: newTailY }
}
