import { readFileSync } from "fs";

/**
 * Reads the file and retuns a list of text lines.
 * @param path Path to the file to read
 * @param separator separator for lines
 * @returns A list of lines
 */
export const readFile = (path: string, separator = "\n") => readFileSync(path).toString().split(separator);