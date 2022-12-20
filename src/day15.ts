import { getData, getLines } from './utils'

// get data for the day and run both parts
getData(15).then((dayData) => {
  const data = getLines(dayData)

  const testData = getLines(`Sensor at x=2, y=18: closest beacon is at x=-2, y=15
  Sensor at x=9, y=16: closest beacon is at x=10, y=16
  Sensor at x=13, y=2: closest beacon is at x=15, y=3
  Sensor at x=12, y=14: closest beacon is at x=10, y=16
  Sensor at x=10, y=20: closest beacon is at x=10, y=16
  Sensor at x=14, y=17: closest beacon is at x=10, y=16
  Sensor at x=8, y=7: closest beacon is at x=2, y=10
  Sensor at x=2, y=0: closest beacon is at x=2, y=10
  Sensor at x=0, y=11: closest beacon is at x=2, y=10
  Sensor at x=20, y=14: closest beacon is at x=25, y=17
  Sensor at x=17, y=20: closest beacon is at x=21, y=22
  Sensor at x=16, y=7: closest beacon is at x=15, y=3
  Sensor at x=14, y=3: closest beacon is at x=15, y=3
  Sensor at x=20, y=1: closest beacon is at x=15, y=3`).map(s => s.trim()).filter(s => s.length !== 0)

  console.log(day15part1(testData, 10))
  console.log(day15part1(data, 2_000_000))

  console.log(day15part2(testData, 20))
  console.log(day15part2(data, 4_000_000))
}).catch(e => console.error(e))

interface Point {
  x: number
  y: number
}

interface Line {
  from: Point
  to: Point
}

interface SensorData {
  sensor: Point
  beacon: Point
}

enum PointData {
  Sensor = 'S',
  Beacon = 'B',
  Occupied = '#',
}

const pointSeparator = ', '

/**
 * Gets the map key from the point coordinates
 */
const key = ({ x, y }: Point): string => `${x}${pointSeparator}${y}`
/**
 * Gets the Point from the map key
 */
const toPoint = (pointStr: string): Point => {
  const [xStr, yStr] = pointStr.split(pointSeparator)

  return { x: parseInt(xStr, 10), y: parseInt(yStr, 10) }
}

// https://adventofcode.com/2022/day/15
export function day15part1 (sensorData: string[], targetRow: number): number {
  const sensors = parseData(sensorData)
  // map of occupied points
  const map = new Map<string, PointData>()

  sensors.forEach(({ sensor, beacon }) => {
    const distance = manhattanDistance(sensor, beacon)

    // set sensor and beacon points on the map
    map.set(key(sensor), PointData.Sensor)
    map.set(key(beacon), PointData.Beacon)

    // calculate the distance between the sensor height and the target row height,
    const yDistance = Math.abs(sensor.y - targetRow)
    // the difference between the height distance would be the maximum x distance from the sensor x coordinate
    const diff = distance - yDistance

    // for every point on the target row that is within the beacon distance, mark it as occupied
    for (let x = 0; x <= diff; x++) {
      const leftPoint = { x: sensor.x - x, y: targetRow }
      const rightPoint = { x: sensor.x + x, y: targetRow }

      if (!map.has(key(leftPoint))) {
        map.set(key(leftPoint), PointData.Occupied)
      }

      if (!map.has(key(rightPoint))) {
        map.set(key(rightPoint), PointData.Occupied)
      }
    }
  })

  let occupiedPoints = 0

  // get the number of occupied points in the target row
  map.forEach((data, key) => {
    const { y } = toPoint(key)

    if (y === targetRow && data === PointData.Occupied) {
      occupiedPoints++
    }
  })

  return occupiedPoints
}

// https://adventofcode.com/2022/day/15#part2
export function day15part2 (sensorData: string[], searchAreaLimit: number): number {
  const sensors = parseData(sensorData)

  let targetX = 0
  let targetY = 0

  const multiplier = 4_000_000

  // for every row in a map within the search area limit
  for (let y = 0; y <= searchAreaLimit; y++) {
    const lines: Line[] = []

    // find the line that the current sensor covers on the y row
    for (let i = 0; i < sensors.length; i++) {
      const { sensor, beacon } = sensors[i]

      const distance = manhattanDistance(sensor, beacon)
      const yDistance = Math.abs(sensor.y - y)
      const diff = distance - yDistance

      if (diff > 0) {
        const from = { x: sensor.x - diff, y }
        const to = { x: sensor.x + diff, y }

        lines.push({ from, to })
      }
    }

    // sort lines so it would be easier to merge
    lines.sort((a, b) => a.from.x - b.from.x)

    // limit lines to the search area
    const limitedLines = lines.map(({ from, to }) => {
      if (from.x < 0) from.x = 0
      if (from.x > searchAreaLimit) from.x = searchAreaLimit
      if (to.x < 0) to.x = 0
      if (to.x > searchAreaLimit) to.x = searchAreaLimit

      return { from, to }
    })

    // merge lines together into a single line that covers the whole row
    // if there is a gap between the lines - that's the point we're looking for
    if (limitedLines.length === 0) {
      console.log(`Skipping row ${y}`)
    } else {
      let unitedLine = limitedLines[0]

      for (let i = 1; i < limitedLines.length; i++) {
        const line = limitedLines[i]

        // if there is a break between the lines, save its coordinates
        if (unitedLine.to.x + 1 < line.from.x) {
          targetX = unitedLine.to.x + 1
          targetY = line.from.y
        } else {
          // merge lines together
          unitedLine = {
            from: { x: unitedLine.from.x, y: unitedLine.from.y },
            to: { x: Math.max(unitedLine.to.x, line.to.x), y: unitedLine.to.y }
          }
        }
      }
    }
  }

  return targetX * multiplier + targetY
}

/**
 * Parses the string data into the SensorData objects
 * @param sensorData Strings with sensors data in the following format:
 * Sensor at x=12, y=14: closest beacon is at x=10, y=16
 * @returns The list of SensorData objects
 */
function parseData (sensorData: string[]): SensorData[] {
  const sensors: SensorData[] = []

  // parse the sensor data strings in the following format:
  // Sensor at x=9, y=16: closest beacon is at x=10, y=16
  sensorData.forEach((sensorDataStr) => {
    const [sensorCoordinates, beaconCoordinates] = sensorDataStr.replace('Sensor at ', '').replace(' closest beacon is at ', '').split(':')

    const [sensorX, sensorY] = sensorCoordinates.split(pointSeparator)
    const [beaconX, beaconY] = beaconCoordinates.split(pointSeparator)

    const getValue = (valueStr: string): number => parseInt(valueStr.split('=')[1], 10)

    const sensor = { x: getValue(sensorX), y: getValue(sensorY) }
    const beacon = { x: getValue(beaconX), y: getValue(beaconY) }

    sensors.push({ sensor, beacon })
  })

  return sensors
}

/**
 * Calculates the manhattan distance bewteen the specified points
 * @param a Point A
 * @param b Point B
 * @returns The manhattan distance bewteen the specified points
 */
const manhattanDistance = (a: Point, b: Point): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
