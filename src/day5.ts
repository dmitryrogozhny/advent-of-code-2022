type Stack = string[];

interface Command {
    quantity: number;
    from: number;
    to: number;
}

interface Cargo {
    stacks: Stack[];
    commands: Command[];
}

// https://adventofcode.com/2022/day/5
export function day5part1(data: string[]): string {
    const cargo = parseCargoData(data);
    cargo.commands.forEach((command) => runCommand9000(cargo.stacks, command));

    const topCrates = cargo.stacks.map((stack) => stack[stack.length - 1]);

    return topCrates.join('');
}

// https://adventofcode.com/2022/day/5#part2
export function day5part2(data: string[]): string {
    const cargo = parseCargoData(data);
    cargo.commands.forEach((command) => runCommand9001(cargo.stacks, command));

    const topCrates = cargo.stacks.map((stack) => stack[stack.length - 1]);

    return topCrates.join('');
}

/**
 * Runs the specified CrateMover 9000 Command on the specified list of Stacks.
 * @param stacks List of stacks
 * @param command Command to run 
 * @returns Updated list of stacks
 */
function runCommand9000(stacks: Stack[], {from, to, quantity}: Command): Stack[] {
    for (let i = 0; i < quantity; i++) {
        const crate = stacks[from].pop();

        if (crate === undefined) {
            throw new Error('Wrong stacks state');
        }

        stacks[to].push(crate);
    }

    return stacks;
}

/**
 * Runs the specified CrateMover 9001 Command on the specified list of Stacks.
 * @param stacks List of stacks
 * @param command Command to run 
 * @returns Updated list of stacks
 */
function runCommand9001(stacks: Stack[], {from, to, quantity}: Command): Stack[] {
    const crates = [];
    for (let i = 0; i < quantity; i++) {
        const crate = stacks[from].pop();

        if (crate === undefined) {
            throw new Error('Wrong stacks state');
        }

        crates.push(crate);
    }

    // reverse the order of moving crates
    crates.reverse();

    for (let i = 0; i < crates.length; i++) {
        stacks[to].push(crates[i]);
    }

    return stacks;
}

/**
 * Parses the cargo data into the Cargo object.
 * @param cargoData String with cargo data
 * @returns The Cargo object containing stacks and commands.
 */
function parseCargoData(cargoData: string[]): Cargo {
    let emptyLineIndex = -1;
    // find the first empty line. The stacks data will be above it, while commands will be below.
    for (let i = 0; i < cargoData.length; i++) {
        if (cargoData[i].trim().length === 0) {
            emptyLineIndex = i;
            break;
        }
    }

    // parse stacks
    const stacksData = cargoData.slice(0, emptyLineIndex - 1);
    const stacksNumbersLine = cargoData[emptyLineIndex - 1].trim();
    const stacksQuantity = parseInt(stacksNumbersLine.charAt(stacksNumbersLine.length - 1), 10);

    const stacks: Stack[] = [];
    
    // init required number of stacks
    for (let i = 0; i < stacksQuantity; i++) {
        stacks.push([]);
    }

    for (let i = 0; i < stacksQuantity; i++) {
        let x = i * 4 + 1;

        for (let y = stacksData.length - 1; y >= 0; y--) {
            const crate = stacksData[y][x];
            if (crate !== ' ') {
                stacks[i].push(crate);
            }
        }
    }

    // parse commands
    const commandsData = cargoData.slice(emptyLineIndex + 1);
    const commands = commandsData.map(parseCommandData);

    return {stacks, commands};
}

/**
 * Parses the string in the move X from Y to Z format into the Command object.
 * The returned command object uses zero-based indicies, while to source data starts indecies from 1.
 * @param commandData String with the command's data
 */
function parseCommandData(commandData: string): Command {
    const [quantity, from, to] = commandData.replace('move', '').replace('from', '').replace('to', '').trim().split('  ').map((value) => parseInt(value, 10));

    // make from and to zero-based indicies
    return {quantity, from: from - 1, to: to - 1};
}