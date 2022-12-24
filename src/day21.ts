import { getData, getLines } from './utils'

// get data for the day and run both parts
getData(21).then((dayData) => {
  const data = getLines(dayData)

  const testData = getLines(`root: pppw + sjmn
  dbpl: 5
  cczh: sllz + lgvd
  zczc: 2
  ptdq: humn - dvpt
  dvpt: 3
  lfqf: 4
  humn: 5
  ljgn: 2
  sjmn: drzm * dbpl
  sllz: 4
  pppw: cczh / lfqf
  lgvd: ljgn * ptdq
  drzm: hmdt - zczc
  hmdt: 32`).map(s => s.trim()).filter(s => s.length !== 0)

  console.log(day21part1(testData))
  console.log(day21part1(data))

  console.log(day21part2(testData))
  console.log(day21part2(data))
}).catch(e => console.error(e))

// https://adventofcode.com/2022/day/21
export function day21part1 (monkeysData: string[]): number {
  const monkeys = getMonkeys(monkeysData)
  return getValue('root', monkeys)
}

// https://adventofcode.com/2022/day/21#part2
export function day21part2 (monkeysData: string[]): number {
  const monkeys = getMonkeys(monkeysData)

  // we should treat the root monkey as the = operation
  const root = monkeys.get('root')

  if (root === undefined || typeof root === 'number') {
    throw new Error('No root monkey found')
  }

  // get two monkeys in the root monkey operation
  const [monkey1, _, monkey2] = root.split(' ')

  // we can calculate the value of the second monkey. The first monkey contains the target human value, so we cannot calculate it yet.
  const target = getValue(monkey2, monkeys)

  // For calculating the first monkey we can "guess" the value of the human monkey.
  // We're using the fact that the target formula is linear.
  // Each step we're adding increment to the human value.
  // If the difference between the target value (monkey2) and the result increases (we compare the current calculation with the previous one),
  // we need to switch the direction - i.e. if we were adding increment, we start subtracting it.
  // We also decrease the increment step by 10 every time the direction changes.
  let humanValue = 0
  let increment = 1_000_000_000_000
  let previousValue: number | undefined
  let direction = 1

  while (true) {
    // try to find the correct value
    monkeys.set('humn', humanValue)
    const value = getValue(monkey1, monkeys)

    if (target === value) {
      return humanValue
    }

    if (previousValue !== undefined) {
      // if the result is worse than the previous one, change the increment direction and decrease the increment size by 10
      if (Math.abs(target - previousValue) < Math.abs(target - value)) {
        direction *= -1
        increment = increment / 10
      }
    }

    humanValue += direction * increment
    previousValue = value
  }
}

/**
 * Parses monkeys' data into the map.
 * Every monkey is either a number or an operation:
 * root: pppw + sjmn
 * dbpl: 5
 * @param monkeysData List of momkeys
 * @returns Map of monkeys
 */
function getMonkeys (monkeysData: string[]): Map<string, string | number> {
  const monkeys = new Map<string, string | number>()

  monkeysData.forEach((monkey) => {
    const [monkeyId, value] = monkey.split(': ')

    // if monkey is a value
    if (value.split(' ').length === 1) {
      monkeys.set(monkeyId, parseInt(value, 10))
    } else {
      // otherwise it's an operation
      monkeys.set(monkeyId, value)
    }
  })

  return monkeys
}

/**
 * Gets the value for the monkey
 * @param monkeyId The monkey Id
 * @param monkeys Map of monkeys
 * @returns The value for the monkey
 */
function getValue (monkeyId: string, monkeys: Map<string, number | string>): number {
  const value = monkeys.get(monkeyId)

  if (value === undefined) {
    throw new Error(`Unknown monkey ${monkeyId}`)
  }

  // can be number or operation
  if (typeof value === 'number') {
    return value
  } else {
    // if operation, get values for arguments separately and then calculate the result
    const [arg1, operation, arg2] = value.split(' ')

    const arg1Value = getValue(arg1, monkeys)
    const arg2Value = getValue(arg2, monkeys)

    switch (operation) {
      case '-':
        return arg1Value - arg2Value
      case '+':
        return arg1Value + arg2Value
      case '*':
        return arg1Value * arg2Value
      case '/':
        return arg1Value / arg2Value
      default:
        throw new Error(`Unknown operation ${operation}`)
    }
  }
}
