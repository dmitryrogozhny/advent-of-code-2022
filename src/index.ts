import dotenv from 'dotenv';
import { getLines, getDayData } from './utils';

import { day2part1, day2part2 } from './day2';

dotenv.config();

async function run() {
    const cookie = process.env.COOKIE;

    console.log(cookie);

    const dayData = await getDayData(2, cookie, './data');
    const data = getLines(dayData);
    
    console.log(day2part1(data));
    console.log(day2part2(data));

}

run();
