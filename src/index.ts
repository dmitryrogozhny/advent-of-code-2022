import dotenv from 'dotenv';
import { getLines, fetchData } from './utils';

import { day1part1, day1part2 } from './day-1'

dotenv.config();

async function run() {
    const day1Data = await fetchData(1);
    const data = getLines(day1Data);
    
    console.log(day1part1(data));
    console.log(day1part2(data));

}

run();
