import { getData, getLines } from './utils'

// get data for the day and run both parts
getData(13).then((dayData) => {
  const data = getLines(dayData)

  const testData = getLines(`[1,1,3,1,1]
  [1,1,5,1,1]
  
  [[1],[2,3,4]]
  [[1],4]
  
  [9]
  [[8,7,6]]
  
  [[4,4],4,4]
  [[4,4],4,4,4]
  
  [7,7,7,7]
  [7,7,7]
  
  []
  [3]
  
  [[[]]]
  [[]]
  
  [1,[2,[3,[4,[5,6,7]]]],8,9]
  [1,[2,[3,[4,[5,6,0]]]],8,9]`).map(s => s.trim()).filter(s => s.length !== 0)

  console.log(day13part1(testData))
  console.log(day13part1(data))

  console.log(day13part2(testData))
  console.log(day13part2(data))
}).catch(e => console.error(e))

interface Pair {
  packet1: number[] | number[][]
  packet2: number[] | number[][]
}

// https://adventofcode.com/2022/day/13
export function day13part1 (packetsData: string[]): number {
  const pairs = parsePairs(packetsData)

  let sum = 0
  for (let i = 0; i < pairs.length; i++) {
    const { packet1, packet2 } = pairs[i]
    const result = getOrder(packet1, packet2)

    if (result === ComparisionResult.Right) {
      sum += i + 1
    }
  }

  return sum
}

// https://adventofcode.com/2022/day/13#part2
export function day13part2 (pairsData: string[]): number {
  const divider1 = [[2]]
  const divider2 = [[6]]
  const packets = [...pairsData.map(parsePacket), divider1, divider2]

  packets.sort((a, b) => {
    const result = getOrder(a, b)

    if (result === ComparisionResult.Unknown) {
      return 0
    } else if (result === ComparisionResult.Right) {
      return -1
    } else {
      return 1
    }
  })

  let index1 = -1
  let index2 = -1

  packets.forEach((packet, index) => {
    if (packet === divider1) {
      index1 = index
    } else if (packet === divider2) {
      index2 = index
    }
  })

  return (index1 + 1) * (index2 + 1)
}

/**
 * Parses the data about packets into Pairs of Packets
 * @param pairsData Data about packets
 * @returns Parsed pairs of packets
 */
function parsePairs (pairsData: string[]): Pair[] {
  const pairs: Pair[] = []

  for (let i = 0; i < pairsData.length; i += 2) {
    const packet1 = parsePacket(pairsData[i])
    const packet2 = parsePacket(pairsData[i + 1])

    // validate the parsing result - compare initial string with a json of a parsed object
    if (!validatePacket(pairsData[i], packet1) || !validatePacket(pairsData[i + 1], packet2)) {
      throw new Error('Parsing error')
    }

    pairs.push({ packet1, packet2 })
  }

  return pairs
}

type Packet = any

/**
 * Parses the string representation of a packet into the object
 */
function parsePacket (packetStr: string): number[] | number[][] {
  const lists: Packet[] = []

  let currentNumber = ''

  for (let i = 0; i < packetStr.length; i++) {
    const character = packetStr[i]

    switch (character) {
      case '[':
        lists.push([])
        break
      case ']':
        if (currentNumber !== '') {
          const num = parseInt(currentNumber, 10)
          lists[lists.length - 1].push(num)
          currentNumber = ''
        }

        if (lists.length !== 1) {
          const list = lists.pop()

          if (list !== undefined) {
            lists[lists.length - 1].push(list)
          }
        }
        break
      case ',':
        if (currentNumber !== '') {
          const num = parseInt(currentNumber, 10)
          lists[lists.length - 1].push(num)
          currentNumber = ''
        }
        break
      default:
        currentNumber += character
        break
    }
  }

  return lists[0]
}

/**
 * Defines if the parsed packet is the same as its description.
 * @param packetData String with the packet description
 * @param packet The packet object
 * @returns True if the parsed packet is the same as its description.
 */
function validatePacket (packetData: string, packet: Packet): boolean {
  return packetData === JSON.stringify(packet)
}

/**
 * Possible results of comparing order of parts of packets
 */
enum ComparisionResult {
  Right = 'Right',
  Wrong = 'Wrong',
  Unknown = 'Unknown'
}

/**
 * Compares two specified packets
 * @param packet1 Packet 1
 * @param packet2 Packet 2
 * @returns Comparision result
 */
function getOrder (packet1: Packet, packet2: Packet): ComparisionResult {
  const maxSize = Math.max(packet1.length, packet2.length)

  for (let i = 0; i < maxSize; i++) {
    const arg1 = packet1[i]
    const arg2 = packet2[i]

    if (arg1 === undefined && arg2 === undefined) {
      return ComparisionResult.Right
    }

    if (arg1 === undefined) {
      return ComparisionResult.Right
    }

    if (arg2 === undefined) {
      return ComparisionResult.Wrong
    }

    const result = compare(arg1, arg2)

    if (result !== ComparisionResult.Unknown) {
      return result
    }
  }

  return ComparisionResult.Right
}

function compare (arg1: number | number[], arg2: number | number[]): ComparisionResult {
  if (arg1 === undefined || arg2 === undefined) {
    throw new Error('Unexpected arguments for comparision')
  }

  // comparing numbers
  if (typeof arg1 === 'number' && typeof arg2 === 'number') {
    return compareNumbers(arg1, arg2)
  }

  // if one of arguments is a number, wrap it in an array
  const array1: number[] = typeof arg1 === 'number' ? wrapInArray(arg1) : arg1
  const array2: number[] = typeof arg2 === 'number' ? wrapInArray(arg2) : arg2

  // comparing arrays
  const maxSize = Math.max(array1.length, array2.length)

  for (let i = 0; i < maxSize; i++) {
    const val1 = array1[i]
    const val2 = array2[i]

    if (val1 === undefined && val2 === undefined) {
      return ComparisionResult.Unknown
    } else if (val1 === undefined) {
      return ComparisionResult.Right
    } else if (val2 === undefined) {
      return ComparisionResult.Wrong
    }

    const result = compare(val1, val2)

    if (result !== ComparisionResult.Unknown) {
      return result
    }
  }

  return ComparisionResult.Unknown
}

/**
 * Compares two numbers
 * @param arg1 Number 1
 * @param arg2 Number 2
 * @returns Comparision result
 */
function compareNumbers (arg1: number, arg2: number): ComparisionResult {
  if (arg1 === arg2) {
    return ComparisionResult.Unknown
  } else if (arg1 > arg2) {
    return ComparisionResult.Wrong
  } else if (arg1 < arg2) {
    return ComparisionResult.Right
  }

  throw new Error('Error comparing numbers')
}

/**
 * If the specified argument is a number, wraps it in a list. Otherwise, returns the argument unchanged.
 * @param maybeNumber Either a number or a list of numbers
 * @returns If the specified argument is a number, wraps it in a list. Otherwise returns the initial argument.
 */
function wrapInArray (maybeNumber: number | number[]): number[] {
  if (typeof maybeNumber === 'number') {
    return [maybeNumber]
  } else {
    return maybeNumber
  }
}
