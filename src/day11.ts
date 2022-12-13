import { getData, getLines } from './utils'

// get data for the day and run both parts
getData(11).then((dayData) => {
  const testData = getLines(`Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old + 0
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`).map((s) => s.trim())

  const data = getLines(dayData)

  // console.log(day11part1(testData))
  console.log(day11part1(data))

  console.log(day11part2(testData))
//   console.log(day11part2(data))
}).catch(e => console.error(e))

interface Monkey {
  id: number
  items: number[]
  operation: string
  test: number
  onTrueTarget: number
  onFalseTarget: number
}

// https://adventofcode.com/2022/day/11
export function day11part1 (monkeysData: string[]): number {
  const monkeys = parseMonkeys(monkeysData)

  const itemsInspected: number[] = Array(monkeys.length).fill(0)
  const roundsAmount = 20

  for (let i = 0; i < roundsAmount; i++) {
    monkeys.forEach((monkey, index) => {
      // sum inspected items each round
      itemsInspected[index] += monkey.items.length
      monkeyMove(monkey, monkeys, (old) => Math.floor(old / 3))
    })
  }

  itemsInspected.sort((a, b) => b - a)

  const monkeyBusiness = itemsInspected[0] * itemsInspected[1]

  return monkeyBusiness
}

// https://adventofcode.com/2022/day/11#part2
export function day11part2 (monkeysData: string[]): number {
  const monkeys = parseMonkeys(monkeysData)

  monkeys.forEach((monkey, index) => {
    if (index === 0) {
      const item = monkey.items[0]
      monkey.items = []
      monkey.items.push(item)
    } else {
      monkey.items = []
    }
  })

  const itemsInspected: number[] = Array(monkeys.length).fill(0)
  const roundsAmount = 100

  for (let i = 0; i < roundsAmount; i++) {
    monkeys.forEach((monkey, index) => {
      // sum inspected items each round
      itemsInspected[index] += monkey.items.length
      monkeyMove(monkey, monkeys, (old) => old)
    })
  }

  itemsInspected.sort((a, b) => b - a)

  const monkeyBusiness = itemsInspected[0] * itemsInspected[1]

  return monkeyBusiness
}

/**
 * Parses the Monkeys description into the list of Monkey objects
 * @param monkeysData Monkeys description
 * @returns List of Monkey objects
 */
function parseMonkeys (monkeysData: string[]): Monkey[] {
  const monkeys: Monkey[] = []
  const linesToDescribeMonkey = 6
  const amount = monkeysData.length / linesToDescribeMonkey

  for (let i = 0; i < amount; i++) {
    const itemsStr = monkeysData[i * linesToDescribeMonkey + 1].trim()
    const operationStr = monkeysData[i * linesToDescribeMonkey + 2].trim()
    const testStr = monkeysData[i * linesToDescribeMonkey + 3].trim()
    const onTrueTargetStr = monkeysData[i * linesToDescribeMonkey + 4].trim()
    const onFalseTargetStr = monkeysData[i * linesToDescribeMonkey + 5].trim()

    const monkey: Monkey = {
      id: i,
      items: itemsStr.split(':')[1].split(',').map(s => s.trim()).map(s => parseInt(s, 10)),
      operation: operationStr.split('= ')[1],
      test: parseInt(testStr.split(' ')[3], 10),
      onTrueTarget: parseInt(onTrueTargetStr.split(' ')[5], 10),
      onFalseTarget: parseInt(onFalseTargetStr.split(' ')[5], 10)
    }

    monkeys.push(monkey)
  }

  return monkeys
}

/**
 * Processes move for a single monkey
 * @param monkey The current monkey
 * @param allMonkeys The list of all monkeys
 */
function monkeyMove (monkey: Monkey, allMonkeys: Monkey[], worryLevelReductor: (old: number) => number): void {
  // process item by item
  while (monkey.items.length !== 0) {
    const item = monkey.items.shift()

    if (item !== undefined) {
      // console.log(monkey.id);

      const worryLevel = runOperation(monkey.operation, item)
      const reductedWorryLevel = worryLevelReductor(worryLevel)

      if (reductedWorryLevel % monkey.test === 0) {
        allMonkeys[monkey.onTrueTarget].items.push(reductedWorryLevel)
      } else {
        allMonkeys[monkey.onFalseTarget].items.push(reductedWorryLevel)
      }
    } else {
      throw new Error(`Unexpected items length: ${monkey.items.length}`)
    }
  }
}

/**
 * Runs the monkey operation and returns the new worry level
 * @param operation Operation string, e.g. old + 4
 * @param old Value of the old worry level
 * @returns New worry level
 */
function runOperation (operation: string, old: number): number {
  const [argument1Str, operator, argument2Str] = operation.split(' ')

  const argument1 = (argument1Str === 'old') ? old : parseInt(argument1Str, 10)
  const argument2 = (argument2Str === 'old') ? old : parseInt(argument2Str, 10)

  switch (operator) {
    case '+':
      return argument1 + argument2
    case '*':
      return argument1 * argument2
    default:
      throw new Error(`Unknown operator ${operator} in operation ${operation}`)
  }
}
