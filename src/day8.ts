import { getData, getGrid } from './utils'

// get data for the day and run both parts
getData(8).then((dayData) => {
  const testData = `30373
25512
65332
33549
35390`

  const data = getGrid(dayData)
  const testDataGrid = getGrid(testData)

  console.log(day8part1(testDataGrid))
  console.log(day8part1(data))

  console.log(day8part2(testDataGrid))
  console.log(day8part2(data))
}).catch(e => console.error(e))

// https://adventofcode.com/2022/day/8
export function day8part1 (grid: string[][]): number {
  const trees = grid.map((row) => row.map((tree) => parseInt(tree, 10)))
  const visibleTrees = new Map<string, number>()

  // look from the west
  for (let y = 0; y < trees.length; y++) {
    let highestTree = -1
    for (let x = 0; x < trees[0].length; x++) {
      const tree = trees[y][x]

      // if tree is visible, add it to list of visible trees
      if (tree > highestTree) {
        visibleTrees.set(`${y}_${x}`, tree)
        highestTree = tree
      }
    }
  }

  // look from the east
  for (let y = 0; y < trees.length; y++) {
    let highestTree = -1
    for (let x = trees[0].length - 1; x >= 0; x--) {
      const tree = trees[y][x]

      // if tree is visible, add it to list of visible trees
      if (tree > highestTree) {
        visibleTrees.set(`${y}_${x}`, tree)
        highestTree = tree
      }
    }
  }

  // look from the north
  for (let x = 0; x < trees[0].length; x++) {
    let highestTree = -1
    for (let y = 0; y < trees.length; y++) {
      const tree = trees[y][x]

      // if tree is visible, add it to list of visible trees
      if (tree > highestTree) {
        visibleTrees.set(`${y}_${x}`, tree)
        highestTree = tree
      }
    }
  }

  // look from the south
  for (let x = 0; x < trees[0].length; x++) {
    let highestTree = -1
    for (let y = trees.length - 1; y >= 0; y--) {
      const tree = trees[y][x]

      // if tree is visible, add it to list of visible trees
      if (tree > highestTree) {
        visibleTrees.set(`${y}_${x}`, tree)
        highestTree = tree
      }
    }
  }

  return visibleTrees.size
}

// https://adventofcode.com/2022/day/8#part2
export function day8part2 (grid: string[][]): number {
  const trees = grid.map((row) => row.map((tree) => parseInt(tree, 10)))

  let max = -1

  for (let y = 0; y < trees.length; y++) {
    for (let x = 0; x < trees[0].length; x++) {
      const viewingDistance = getViewingDistance(y, x, trees)

      if (viewingDistance > max) {
        max = viewingDistance
      }
    }
  }

  return max
}

/**
 * Get the viewing distance score of a tree in the specified position
 * @param y Y position
 * @param x X position
 * @param grid Grid
 * @returns The viewing distance score of the specified tree
 */
function getViewingDistance (y: number, x: number, grid: number[][]): number {
  const treeHeight = grid[y][x]
  let left = 0
  let right = 0
  let up = 0
  let down = 0

  // left
  for (let i = x - 1; i >= 0; i--) {
    left++

    if (grid[y][i] >= treeHeight) {
      break
    }
  }

  // right
  for (let i = x + 1; i < grid[0].length; i++) {
    right++

    if (grid[y][i] >= treeHeight) {
      break
    }
  }

  // up
  for (let i = y - 1; i >= 0; i--) {
    up++

    if (grid[i][x] >= treeHeight) {
      break
    }
  }

  // down
  for (let i = y + 1; i < grid.length; i++) {
    down++

    if (grid[i][x] >= treeHeight) {
      break
    }
  }

  return left * right * up * down
}
