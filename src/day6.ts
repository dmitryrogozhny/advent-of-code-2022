import { getData } from './utils'

// get data for the day and run both parts
getData(6).then((dayData) => {
  console.log(day6part1(dayData))
  console.log(day6part2(dayData))
}).catch(e => console.error(e))

// https://adventofcode.com/2022/day/6
export function day6part1 (buffer: string): number {
  return findMarker(buffer, 4)
}

// https://adventofcode.com/2022/day/6#part2
export function day6part2 (buffer: string): number {
  return findMarker(buffer, 14)
}

/**
 * Get the position of the marker for the unique characters sequence.
 * @param buffer string with characters
 * @param sequenceSize The size of sequence of unique characters to find
 * @returns The position of a character after which the sequence has formed
 */
function findMarker (buffer: string, sequenceSize: number): number {
  const map = new Map<string, number>()

  for (let i = 0; i < buffer.length; i++) {
    const character = buffer[i]

    if (!map.has(character)) {
      map.set(character, 0)
    }

    const count = map.get(character)

    // add frequency for the current character
    if (count !== undefined) {
      map.set(character, count + 1)
    }

    const firstInSequenceIndex = i - sequenceSize

    // remove a character from the frequency map once it's out of sequence
    if (firstInSequenceIndex >= 0) {
      const count = map.get(buffer[firstInSequenceIndex])
      if (count !== undefined) {
        map.set(buffer[firstInSequenceIndex], count - 1)
      }
    }

    // wait untill there are the right amount of characters in a sequence
    let uniquesCount = 0
    map.forEach((value) => {
      if (value === 1) {
        uniquesCount++
      }
    })

    if (uniquesCount === sequenceSize) {
      return i + 1
    }
  }

  throw new Error(`No sequence of ${sequenceSize} different characters found`)
}
