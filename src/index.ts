import { readFile } from './utils';

import { day1part1, day1part2 } from './day-1'

const data = readFile('./data/day1.txt');

console.log(day1part1(data));
console.log(day1part2(data));
