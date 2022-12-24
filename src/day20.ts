import { getData, getLines } from './utils'

// get data for the day and run both parts
getData(20).then((dayData) => {
  const data = getLines(dayData)

  const testData = getLines(`1
  2
  -3
  3
  -2
  0
  4`).map(s => s.trim()).filter(s => s.length !== 0)

  console.log(day20part1(testData))
  console.log(day20part1(data))

  console.log(day20part2(testData))
  console.log(day20part2(data))
}).catch(e => console.error(e))

interface ListItem {
  value: number
  originalPosition: number
  next: ListItem
  previous: ListItem
}

// https://adventofcode.com/2022/day/20
export function day20part1 (file: string[]): number {
  const numbers = file.map((line) => parseInt(line, 10))
  const map = buildCircularList(numbers)

  runCycle(map)

  return getTargetSum(map)
}

// https://adventofcode.com/2022/day/20#part2
export function day20part2 (file: string[]): number {
  const decryptionKey = 811589153
  const rotationCycles = 10

  const numbers = file.map((line) => parseInt(line, 10) * decryptionKey)
  const map = buildCircularList(numbers)

  for (let i = 0; i < rotationCycles; i++) {
    runCycle(map)
  }

  return getTargetSum(map)
}

/**
 * Finds the sum of 1000th, 2000th, and 3000th elements from the 0 item
 * @param map The map of list items by their initial order
 */
function getTargetSum (map: Map<number, ListItem>): number {
  // find the item with 0 value
  let zeroItem = map.get(0) as ListItem

  if (zeroItem === undefined) {
    throw new Error()
  }

  while (zeroItem.value !== 0) {
    zeroItem = zeroItem.next
  }

  // find values for 1000th, 2000th, and 3000th items from zero
  const offsets = [1000, 2000, 3000]
  // find items skipping full cycles
  const values = offsets.map((offset) => findItem(zeroItem, offset % map.size).value)

  const sum = values.reduce((sum, value) => sum + value)

  return sum
}

/**
 * Applies rotation to all numbers in the list
 * @param map The map of list items by their initial order.
 */
function runCycle (map: Map<number, ListItem>): void {
  // get list items one by one in their initial order
  for (let i = 0; i < map.size; i++) {
    const item = map.get(i)

    if (item === undefined) {
      throw new Error(`Unknown id for the item ${i}`)
    }

    // move item n positions, skip full circles
    const positions = item.value % (map.size - 1)

    for (let k = 0; k < Math.abs(positions); k++) {
      if (positions === 0) {
        // do nothing
      } else if (positions > 0) {
        // move one position clockwise
        swap(item, item.next)
      } else {
        // move one position counter clockwise
        swap(item.previous, item)
      }
    }
  }
}

/**
 * Builds the circular list for the specified list of items. Returns the map for quick access to list items by their initial order.
 * @param numbers The list of numbers
 * @returns The map of items by their initial order
 */
function buildCircularList (numbers: number[]): Map<number, ListItem> {
  const map = new Map<number, ListItem>()

  // create root item
  let listItem = { value: numbers[0], originalPosition: 0 } as ListItem // eslint-disable-line @typescript-eslint/consistent-type-assertions

  listItem.next = listItem
  listItem.previous = listItem

  map.set(0, listItem)

  for (let i = 1; i < numbers.length; i++) {
    const newListItem = {
      value: numbers[i],
      originalPosition: i,
      next: listItem.next,
      previous: listItem
    }

    // fix links for previous and next items
    listItem.next.previous = newListItem
    listItem.next = newListItem

    listItem = newListItem

    map.set(i, listItem)
  }

  return map
}

/**
 * Returns the item that is N steps away from the specified one.
 * @param from The list item
 * @param steps The amount of steps
 * @returns The list item
 */
function findItem (from: ListItem, steps: number): ListItem {
  let target = from
  for (let i = 0; i < steps; i++) {
    target = target.next
  }

  return target
}

/**
 * Swaps two adjacent list items
 * @param a First list item
 * @param b Second list item
 */
function swap (a: ListItem, b: ListItem): void {
  a.next = b.next
  b.next.previous = a

  b.previous = a.previous
  a.previous.next = b

  b.next = a
  a.previous = b
}

/**
 * Prints out the list to the console
 */
function _print (listItem: ListItem | undefined): void {
  if (listItem === undefined) {
    throw new Error()
  }

  let path = `${listItem.value}`
  const value = listItem.value

  while (value !== listItem.next.value) {
    path += ` -> ${listItem.next.value}`
    listItem = listItem.next
  }

  console.log(path)
}
