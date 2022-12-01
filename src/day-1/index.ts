// https://adventofcode.com/2022/day/1
export function day1part1 (caloriesData: string[]): number {
  const elves = parseCalories(caloriesData)
  const maxCalories = elves.reduce((max, value) => value > max ? value : max)

  return maxCalories
}

// https://adventofcode.com/2022/day/1#part2
export function day1part2 (caloriesData: string[]): number {
  const elves = parseCalories(caloriesData)

  const top3 = elves.sort((a, b) => b - a).slice(0, 3).reduce((sum, value) => sum + value)

  return top3
}

/**
 * Returns a list of elves with sum of their calories
 * @param caloriesData list of calories for elves separated by empty lines
 * @returns list of elves with sum of calories they hold
 */
function parseCalories (caloriesData: string[]): number[] {
  const elves: number[] = []

  let caloriesSum = 0
  for (let i = 0; i < caloriesData.length; i++) {
    const caloriesStr = caloriesData[i]

    if (caloriesStr !== '') {
      const caloriesValue = parseInt(caloriesStr, 10)
      caloriesSum += caloriesValue
    } else {
      elves.push(caloriesSum)
      caloriesSum = 0
    }
  }

  return elves
}
