import dotenv from 'dotenv'
import { getLines, getDayData } from './utils'

import { day6part1, day6part2 } from './day6'

dotenv.config()

async function run (): Promise<void> {
  const cookie = process.env.COOKIE
  const dayData = await getDayData(6, cookie, './data')
  const data = getLines(dayData)
  // Test cases for part 1
  // console.log(day6part1('mjqjpqmgbljsphdztnvjfqwrcgsmlb'));
  // console.log(day6part1('bvwbjplbgvbhsrlpgdmjqwftvncz'));
  // console.log(day6part1('nppdvjthqldpwncqszvftbrmjlhg'));
  // console.log(day6part1('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'));
  // console.log(day6part1('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'));

  console.log(day6part1(data[0]))

  // Test cases for part 2
  // console.log(day6part2('mjqjpqmgbljsphdztnvjfqwrcgsmlb'));
  // console.log(day6part2('bvwbjplbgvbhsrlpgdmjqwftvncz'));
  // console.log(day6part2('nppdvjthqldpwncqszvftbrmjlhg'));
  // console.log(day6part2('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'));
  // console.log(day6part2('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'));

  console.log(day6part2(data[0]))
}

run().catch((error) => console.error(error))
