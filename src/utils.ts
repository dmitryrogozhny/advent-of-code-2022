import { readFileSync } from "fs";

export function readFile(path: string, separator = "\n"): string[] {
    const lines = readFileSync(path).toString();

    return lines.split(separator);
}