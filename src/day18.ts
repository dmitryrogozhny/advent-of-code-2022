import { getData, getLines } from './utils'

// get data for the day and run both parts
getData(18).then((dayData) => {
  const data = getLines(dayData)

  const testData = getLines(`2,2,2
  1,2,2
  3,2,2
  2,1,2
  2,3,2
  2,2,1
  2,2,3
  2,2,4
  2,2,6
  1,2,5
  3,2,5
  2,1,5
  2,3,5`).map(s => s.trim()).filter(s => s.length !== 0)

  console.log(day18part1(testData))
  console.log(day18part1(data))

//   console.log(day17part2(testData))
//   console.log(day17part2(data[0], possibleRockTypes))
}).catch(e => console.error(e))

interface Point {
  x: number
  y: number
  z: number
}

// https://adventofcode.com/2022/day/18
export function day18part1 (lavaData: string[]): number {
  const cubes = lavaData.map(toPoint)

  let intersections = 0

  for (let m = 0; m < cubes.length; m++) {
    for (let n = 0; n < cubes.length; n++) {
      const distance = getDistance(cubes[m], cubes[n])

      if (distance === 1) {
        intersections++
      }
    }
  }

  const sides = cubes.length * 6
  const freeSides = sides - intersections

  return freeSides
}

// https://adventofcode.com/2022/day/18#part2
export function day18part2 (lavaData: string[]): number {
  return lavaData.length
}

/**
 * Converts the string in the x,y,z format into the Point
 * @param pointData String in the x,y,z format
 * @returns The Point object
 */
function toPoint (pointData: string): Point {
  const [x, y, z] = pointData.split(',').map((s) => parseInt(s, 10))

  return { x, y, z }
}

/**
 * Returns the distance between two points
 * @param a Point a
 * @param b Point b
 * @returns The distance between two points
 */
function getDistance (a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)
}
