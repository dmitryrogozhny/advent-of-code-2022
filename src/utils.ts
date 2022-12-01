import { readFileSync } from "fs";
import fetch from 'node-fetch';

/**
 * Reads the file and retuns a list of text lines.
 * @param path Path to the file to read
 * @param separator separator for lines
 * @returns A list of lines
 */
export const readFile = (path: string) => getLines(readFileSync(path).toString());

/**
 * Returns the data from the advent of code site for the specified day
 * @param day The target day of the advent
 */
export const fetchData = async (day: number) => {
    const cookie = process.env.COOKIE;

    if (cookie === undefined) {
        throw new Error('Cookie is required for getting data. Please check the COOKIE value in the .env file.');
    }

    const response = await fetch(`https://adventofcode.com/2022/day/${day}/input`, { headers: {cookie}});
    const body = await response.text();
    
    return body;
}

/**
 * Splits data into lines.
 * @param data String with lines of data
 * @param separator Optional separator. By default, new line is used.
 * @returns List with lines of data
 */
export const getLines = (data: string, separator = '\n') => data.split(separator);