import dotenv from 'dotenv'
import { getLines, getDayData } from './utils'

import { day2part1, day2part2 } from './day2'

dotenv.config()

async function run (): Promise<void> {
  const cookie = process.env.COOKIE
  const dayData = await getDayData(2, cookie, './data')
  const data = getLines(dayData)

  const testDayData = `A Y
  B X
  C Z`;

  const testData = getLines(testDayData).map(s => s.trim());

  console.log(day2part1(data))
  console.log(day2part2(data))
}

run().catch((error) => console.error(error))
