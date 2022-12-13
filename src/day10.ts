import { getData, getLines } from './utils'

// get data for the day and run both parts
getData(10).then((dayData) => {
  const data = getLines(dayData)

  const testData = getLines(`addx 15
  addx -11
  addx 6
  addx -3
  addx 5
  addx -1
  addx -8
  addx 13
  addx 4
  noop
  addx -1
  addx 5
  addx -1
  addx 5
  addx -1
  addx 5
  addx -1
  addx 5
  addx -1
  addx -35
  addx 1
  addx 24
  addx -19
  addx 1
  addx 16
  addx -11
  noop
  noop
  addx 21
  addx -15
  noop
  noop
  addx -3
  addx 9
  addx 1
  addx -3
  addx 8
  addx 1
  addx 5
  noop
  noop
  noop
  noop
  noop
  addx -36
  noop
  addx 1
  addx 7
  noop
  noop
  noop
  addx 2
  addx 6
  noop
  noop
  noop
  noop
  noop
  addx 1
  noop
  noop
  addx 7
  addx 1
  noop
  addx -13
  addx 13
  addx 7
  noop
  addx 1
  addx -33
  noop
  noop
  noop
  addx 2
  noop
  noop
  noop
  addx 8
  noop
  addx -1
  addx 2
  addx 1
  noop
  addx 17
  addx -9
  addx 1
  addx 1
  addx -3
  addx 11
  noop
  noop
  addx 1
  noop
  addx 1
  noop
  noop
  addx -13
  addx -19
  addx 1
  addx 3
  addx 26
  addx -30
  addx 12
  addx -1
  addx 3
  addx 1
  noop
  noop
  noop
  addx -9
  addx 18
  addx 1
  addx 2
  noop
  noop
  addx 9
  noop
  noop
  noop
  addx -1
  addx 2
  addx -37
  addx 1
  addx 3
  noop
  addx 15
  addx -21
  addx 22
  addx -6
  addx 1
  noop
  addx 2
  addx 1
  noop
  addx -10
  noop
  noop
  addx 20
  addx 1
  addx 2
  addx 2
  addx -6
  addx -11
  noop
  noop
  noop`).map((s) => s.trim())

  console.log(day10part1(testData))
  console.log(day10part1(data))
  console.log(day10part2(testData))
  console.log(day10part2(data))
}).catch(e => console.error(e))

// https://adventofcode.com/2022/day/10
export function day10part1 (commands: string[]): number {
  const cyclesLog = calculateCycles(commands, 1, 1)

  // get values for specific cycles
  const startCycle = 20
  const increment = 40
  const incrementsAmount = 6

  let signalStrengths = 0

  for (let i = 0; i < incrementsAmount; i++) {
    const targetCycle = startCycle + i * increment

    const value = getValue(cyclesLog, targetCycle)
    signalStrengths += value * targetCycle
  }

  return signalStrengths
}

// https://adventofcode.com/2022/day/10#part2
export function day10part2 (commands: string[]): string {
  const cyclesLog = calculateCycles(commands, 1, 1)

  const width = 40
  const height = 6

  let image = ''

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cycle = y * width + x + 1
      const value = getValue(cyclesLog, cycle)

      image += (Math.abs(x - value) < 2) ? '#' : ' '
    }

    image += '\n'
  }

  return image
}

/**
 * Gets the map of calculated cycle-value pairs. If a value is missing for a cycle, then the addx operation was in the middle at this cycle.
 * @param commands List of commands
 * @param initialCycle Initial cycle number
 * @param initialValue Initial register value
 * @returns Map with caclulated cycle-value pairs
 */
function calculateCycles (commands: string[], initialCycle: number, initialValue: number): Map<number, number> {
  const map = new Map<number, number>()
  map.set(initialCycle, initialValue)

  let X = initialValue
  let cycle = initialCycle

  for (let i = 0; i < commands.length; i++) {
    const [command, argumentStr] = commands[i].split(' ')

    switch (command) {
      case 'noop':
        cycle += 1
        break
      case 'addx':
        X += parseInt(argumentStr, 10)
        cycle += 2
    }

    map.set(cycle, X)
  }

  return map
}

/**
 * Gets the register value at the specified cycle.
 * If a value is missing in the log for a cycle, then the addx operation was in the middle at this cycle.
 * In this case, return the value at the previous cycle.
 * @param cyclesLog Map of cycle-value pairs.
 * @param cycle Cycle number
 * @returns Register value at the specified cycle.
 */
function getValue (cyclesLog: Map<number, number>, cycle: number): number {
  const value = cyclesLog.has(cycle) ? cyclesLog.get(cycle) : cyclesLog.get(cycle - 1)

  if (value !== undefined) {
    return value
  } else {
    throw new Error(`Cannot find the value for the cycle ${cycle}`)
  }
}
