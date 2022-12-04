import dotenv from 'dotenv'
import { day3part1, day3part2 } from './day3'
import { getLines, getDayData } from './utils'

dotenv.config()

async function run (): Promise<void> {
  const cookie = process.env.COOKIE
  const dayData = await getDayData(3, cookie, './data')
  const data = getLines(dayData)

  const testDayData = `vJrwpWtwJgWrhcsFMMfFFhFp
  jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
  PmmdzqPrVvPwwTWBwg
  wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
  ttgJtRGJQctTZtZT
  CrZsJsPPZsGzwwsLwLmpwMDw`;

  const testData = getLines(testDayData).map(s => s.trim());

  console.log(day3part1(data))
  console.log(day3part2(data))
}

run().catch((error) => console.error(error))
