// https://adventofcode.com/2022/day/1
export function day1part1 (caloriesData: string[]): number {
  const elves = parseCalories(caloriesData)
  const maxCalories = elves.reduce((max, value) => value > max ? value : max)

  return maxCalories
}

export function day1part2 (): number {
  return -1
}

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
