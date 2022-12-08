import { getData, getLines } from './utils'

// get data for the day and run both parts
getData(4).then((dayData) => {
  const data = getLines(dayData)

  console.log(day4part1(data))
  console.log(day4part2(data))
}).catch(e => console.error(e))

interface Range {
  from: number
  to: number
}

// https://adventofcode.com/2022/day/4
export function day4part1 (data: string[]): number {
  // parse data from strings into Range objects
  const rangePairs = data.map(getRanges)
  // sort range pairs, so the first range from is always smaller or equal to the second from.
  // This makes further comparision simpler
  rangePairs.forEach((rangePair) => rangePair.sort((a, b) => a.from - b.from))

  const fullyContainedRanges = rangePairs.filter(([range1, range2]) => {
    // because of previous sorting, r1.from will always be smaller or equal to r2.from,
    // so we only need to check cases when r1.from === r2.from (in any case 2 ranges overlap)
    // and when the first range overlaps the second, i.e. r1.to is more the r2.to
    if (range1.from === range2.from) {
      return true
    } else {
      return range1.to >= range2.to
    }
  })

  return fullyContainedRanges.length
}

// https://adventofcode.com/2022/day/4#part2
export function day4part2 (data: string[]): number {
  // parse data from strings into Range objects
  const rangePairs = data.map(getRanges)
  // sort range pairs, so the first range from is always smaller or equal to the second from.
  // This makes further comparision simpler
  rangePairs.forEach((rangePair) => rangePair.sort((a, b) => a.from - b.from))

  // because of previous sorting, r1.from will always be smaller or equal to r2.from,
  // so we need to check only the right side of range, i.e. r1.to
  const overlappingRanges = rangePairs.filter(([range1, range2]) => {
    return range1.to >= range2.from
  })

  return overlappingRanges.length
}

/**
 * Parses the string and returns two ranges
 * @param rangesStr The string in the a-b,y-z format
 * @returns The array with two ranges
 */
function getRanges (rangesStr: string): Range[] {
  const [range1Str, range2Str] = rangesStr.split(',')

  return [getRange(range1Str), getRange(range2Str)]
}

/**
 * Parses the range string and retuns a Range object
 * @param rangeStr The string in the a-b format, where a and b are two integers
 * @returns
 */
function getRange (rangeStr: string): Range {
  const [fromStr, toStr] = rangeStr.split('-')

  return { from: parseInt(fromStr, 10), to: parseInt(toStr, 10) }
}
