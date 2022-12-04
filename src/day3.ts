// https://adventofcode.com/2022/day/3
export function day3part1 (data: string[]): number {
  const commonItems = data.map((rucksack) => {
    // split rucksack into two compartments
    const compartment1 = rucksack.substring(0, rucksack.length / 2)
    const compartment2 = rucksack.substring(rucksack.length / 2)

    return getCommonItem([compartment1, compartment2])
  })

  const priorities = commonItems.map(getPriority)
  const sum = priorities.reduce((sum, priority) => sum + priority)

  return sum
}

// https://adventofcode.com/2022/day/3#part2
export function day3part2 (data: string[]): number {
  const commonItems: string[] = []

  for (let i = 0; i < data.length; i += 3) {
    // get group of 3 elves and find their common item
    const group = [data[i], data[i + 1], data[i + 2]]
    const commonItem = getCommonItem(group)

    commonItems.push(commonItem)
  }

  const priorities = commonItems.map(getPriority)
  const sum = priorities.reduce((sum, priority) => sum + priority)

  return sum
}

/**
 * Finds the item that is common in all items.
 * @param items List of items
 * @returns The common item between all items
 */
function getCommonItem (items: string[]): string {
  const [firstItemsMap, ...otherMaps] = items.map(getItemsMap)

  let commonItem: string | undefined

  firstItemsMap.forEach((value, key) => {
    let hasCommonKey = true

    otherMaps.forEach((map) => {
      if (!map.has(key)) {
        hasCommonKey = false
      }
    })

    if (hasCommonKey) {
      commonItem = key
    }
  })

  if (commonItem !== undefined) {
    return commonItem
  } else {
    throw new Error(`No common item found in ${items.join(' ')}`)
  }
}

/**
 * Gets the map for the items. The item's value is used as a key, the amount of such item is a value.
 * @param items List of items
 * @returns Map for items
 */
function getItemsMap (items: string): Map<string, number> {
  const map = new Map<string, number>()

  for (let i = 0; i < items.length; i++) {
    if (!map.has(items[i])) {
      map.set(items[i], 0)
    }

    const count = map.get(items[i])

    if (count !== undefined) {
      map.set(items[i], count + 1)
    }
  }

  return map
}

// Char codes for calculating item's priority
const aCode = 'a'.charCodeAt(0)
const zCode = 'z'.charCodeAt(0)
const ACode = 'A'.charCodeAt(0)
const ZCode = 'Z'.charCodeAt(0)

// Amounts to reduct to get from the char code to priority for lower and uppercase letters
const lowercaseShift = 96
const uppercaseShift = 38

/**
 * Gets the priority of an item
 * @param item The item
 * @returns The priority of the specified item
 */
function getPriority (item: string): number {
  const itemCode = item.charCodeAt(0)

  if (itemCode >= aCode && itemCode <= zCode) {
    return itemCode - lowercaseShift
  } else if (itemCode >= ACode && itemCode <= ZCode) {
    return itemCode - uppercaseShift
  } else {
    throw new Error(`Unsupported item: ${item}`)
  }
}
