import { getData, getLines } from './utils'

// get data for the day and run both parts
getData(16).then((dayData) => {
  const data = getLines(dayData)

  const testData = getLines(`Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
  Valve BB has flow rate=13; tunnels lead to valves CC, AA
  Valve CC has flow rate=2; tunnels lead to valves DD, BB
  Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
  Valve EE has flow rate=3; tunnels lead to valves FF, DD
  Valve FF has flow rate=0; tunnels lead to valves EE, GG
  Valve GG has flow rate=0; tunnels lead to valves FF, HH
  Valve HH has flow rate=22; tunnel leads to valve GG
  Valve II has flow rate=0; tunnels lead to valves AA, JJ
  Valve JJ has flow rate=21; tunnel leads to valve II`).map(s => s.trim()).filter(s => s.length !== 0)

  console.log(day16part1(testData))
  console.log(day16part1(data))

  // console.log(day16part2(testData))
//   console.log(day16part2(data))
}).catch(e => console.error(e))

interface Valve {
  id: string
  flowRate: number
  connections: string[]
}

let maxPressureReleased = -1
let maxPressureReleasedWithElephant = -1

// https://adventofcode.com/2022/day/16
export function day16part1 (scanOutput: string[]): number {
  const timeLimit = 30
  const startingValveId = 'AA'

  const valves = parseValves(scanOutput)
  const visited = new Map<string, number>()

  simulate(startingValveId, [], 0, timeLimit, valves, visited)

  return maxPressureReleased
}

// https://adventofcode.com/2022/day/16#part2
export function day16part2 (scanOutput: string[]): number {
  const timeLimit = 26
  const startingValveId = 'AA'

  const valves = parseValves(scanOutput)
  const visited = new Map<string, number>()

  return maxPressureReleasedWithElephant
}

/**
 * Parses the valves' data into the list of Valve objects
 * @param valvesData The list of strings in the following format: Valve EE has flow rate=3; tunnels lead to valves FF, DD
 * @returns The parsed list of Valve objects.
 */
function parseValves (valvesData: string[]): Map<string, Valve> {
  const valves: Valve[] = valvesData.map((valveStr) => {
    const [info, connections] = valveStr.replace('Valve ', '')
      .replace('has flow rate=', '')
      .replace(' tunnels lead to valves ', '')
      .replace(' tunnel leads to valve ', '')
      .split(';')

    const [id, flowRateStr] = info.split(' ')
    const connectedValves = connections.split(', ')

    return {
      id,
      flowRate: parseInt(flowRateStr, 10),
      connections: connectedValves
    }
  })

  const map = new Map<string, Valve>()
  valves.forEach((valve) => map.set(valve.id, valve))

  return map
}

/**
 * Simulates the valve opening
 * @param currentValveId Current postion
 * @param openedValvesIds Valves opened so far
 * @param pressureReleased Pressure released so far
 * @param minute Current minute
 * @param valves Map of valves
 * @param visited Map of visited valves at the specific point in time
 * @returns
 */
function simulate (currentValveId: string, openedValvesIds: string[],
  pressureReleased: number, minute: number,
  valves: Map<string, Valve>, visited: Map<string, number>): void {
  if (minute === 0) {
    if (pressureReleased > maxPressureReleased) {
      maxPressureReleased = pressureReleased
    }

    return
  }

  // check if there's a better result for the same conditions:
  // for the current valve, open valves, and the pressure released, check the minute
  // exit if better result already exists
  const openedValvesIdsStr: string = openedValvesIds.join('_')
  const key = `${currentValveId}-${openedValvesIdsStr}-${pressureReleased}`

  // If we've visited the current valve already with the same condition
  if (visited.has(key)) {
    // get the minute that we were here before
    const bestMinute = visited.get(key)

    if (bestMinute === undefined) {
      throw new Error(`Wrong value for the visited key ${key}`)
    }

    // If the current time is worse than the previus, exit
    if (minute < bestMinute) {
      return
    } else {
      // set the combination of the current position, opened valves, and pressure release as the best result
      visited.set(key, minute)
    }
  } else {
    // set the combination of the current position, opened valves, and pressure release as the best result
    visited.set(key, minute)
  }

  const valve = valves.get(currentValveId)

  if (valve === undefined) {
    throw new Error(`Unknown valve id ${currentValveId}`)
  }

  // if the valve is not opened and the flow rate is not 0, open it
  if (!openedValvesIds.includes(valve.id) && valve.flowRate !== 0) {
    // calculate the amount of pressure that will be released and add it to the total
    const updatedPressureReleased = pressureReleased + valve.flowRate * (minute - 1)

    // mark the current valve as opened
    // valves are sorted
    const updatedOpenedValvesIds = [...openedValvesIds, valve.id].sort()

    simulate(valve.id, updatedOpenedValvesIds, updatedPressureReleased, minute - 1, valves, visited)
  }

  // simulate going to every connected pipe
  for (let i = 0; i < valve.connections.length; i++) {
    const connectedValveId = valve.connections[i]

    simulate(connectedValveId, openedValvesIds, pressureReleased, minute - 1, valves, visited)
  }
}
