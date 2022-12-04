import dotenv from 'dotenv'
import { day4part1, day4part2 } from './day4'
import { getLines, getDayData } from './utils'

dotenv.config()

async function run (): Promise<void> {
  const cookie = process.env.COOKIE
  const dayData = await getDayData(4, cookie, './data')
  const data = getLines(dayData)

  const testDayData = `2-4,6-8
  2-3,4-5
  5-7,7-9
  2-8,3-7
  6-6,4-6
  2-6,4-8`

  const testData = getLines(testDayData).map(s => s.trim())

  console.log(day4part1(data))
  console.log(day4part2(data))
}

run().catch((error) => console.error(error))
