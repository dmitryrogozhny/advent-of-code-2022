import { writeFileSync, readFileSync } from 'fs'
import dotenv from 'dotenv'

import fetch from 'node-fetch'
import path from 'path'

/**
 * Returns the data from the advent of code site for the specified day
 * @param day The target day of the advent
 */
export const fetchData = async (day: number, headers: { [key: string]: string }): Promise<string> => {
  const response = await fetch(`https://adventofcode.com/2022/day/${day}/input`, { headers })
  const body = await response.text()

  return body
}

/**
 * Splits data into lines.
 * @param data String with lines of data
 * @param separator Optional separator. By default, new line is used.
 * @returns List with lines of data
 */
export const getLines = (data: string, skipEmptyLines = true, separator = '\n'): string[] => data.split(separator).filter(s => !skipEmptyLines || s.length !== 0)

/**
 * Returns the grid of characters from the specified string.
 * @param data String with a grid
 * @returns The grid of characters
 */
export function getGrid (data: string): string[][] {
  const lines = getLines(data)

  const rows = lines.map((line) => line.split(''))
  const grid: string[][] = [...rows]

  return grid
}

export async function getData (day: number): Promise<string> {
  dotenv.config()

  const cookie = process.env.COOKIE
  return await getDayData(day, cookie, './data')
}

export async function getDayData (day: number, sessionCookie: string | undefined, dataFolderPath: string): Promise<string> {
  const fileName = `day${day}.txt`

  // try to get data from the local data folder
  try {
    const data = readFileSync(path.join(dataFolderPath, fileName)).toString()

    return await Promise.resolve(data)
  } catch (error) {
    console.error(`No local version of data available for day ${day}`)
  }

  // if session cookie is available, fetch day's data from the adventofcode site
  if (sessionCookie !== undefined) {
    const data = await fetchData(day, { cookie: sessionCookie })

    // save day's data to a local folder
    writeFileSync(path.join(dataFolderPath, fileName), data)

    return data
  }

  // no data available for the day
  throw new Error(`No data is available for the day ${day}. Check the ${dataFolderPath} folder for the data file`)
}
