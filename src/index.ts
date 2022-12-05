import dotenv from 'dotenv'
import { day5part1, day5part2 } from './day5'
import { getLines, getDayData } from './utils'

dotenv.config()

async function run (): Promise<void> {
  const cookie = process.env.COOKIE
  const dayData = await getDayData(5, cookie, './data')
  const data = getLines(dayData, false)

  const testDayData = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`

  // const testData = getLines(testDayData).map(s => s.trim())
  const testData = getLines(testDayData, false);
  console.log(day5part1(data))
  console.log(day5part2(data))
}

run().catch((error) => console.error(error))
