enum Shape {
  Rock = 'A',
  Paper = 'B',
  Scissors = 'C',
}

interface Round {
  shape1: Shape
  shape2: Shape
}

interface CompletedRound {
    round: Round;
    points1: number;
    points2: number;
}

const createCompletedRound = (shape1: Shape, shape2: Shape, points1: number, points2: number): CompletedRound => (
    {
        round: { shape1, shape2 },
        points1,
        points2,
    }
);

// all possible combinations for the game
const possibeResults: CompletedRound[] = [
    // you Rock
    createCompletedRound(Shape.Rock, Shape.Rock, 3, 3),
    createCompletedRound(Shape.Paper, Shape.Rock, 6, 0),
    createCompletedRound(Shape.Scissors, Shape.Rock, 0, 6),
    // you Paper
    createCompletedRound(Shape.Rock, Shape.Paper, 0, 6),
    createCompletedRound(Shape.Paper, Shape.Paper, 3, 3),
    createCompletedRound(Shape.Scissors, Shape.Paper, 6, 0),
    // you Scissors
    createCompletedRound(Shape.Rock, Shape.Scissors, 6, 0),
    createCompletedRound(Shape.Paper, Shape.Scissors, 0, 6),
    createCompletedRound(Shape.Scissors, Shape.Scissors, 3, 3),
];

// 1 for Rock, 2 for Paper, and 3 for Scissors
const pointsForShape = (shape: Shape): number => (shape === Shape.Rock) ? 1 : ((shape === Shape.Paper) ? 2 : 3)

// https://adventofcode.com/2022/day/2
export function day2part1 (roundsData: string[]): number {
  const rounds = roundsData.map(round)
  const points = rounds.reduce(
    (sum, round) => {
        const forShape = pointsForShape(round.shape2);
        const result = possibeResults.find((result) => result.round.shape1 === round.shape1 && result.round.shape2 === round.shape2);
      
        if (result === undefined) {
          throw new Error(`Unknown combination ${round.shape1 + round.shape2}`)
        }
        
        const forOutcome = result.points2;
      
        return sum + forShape + forOutcome
    },
    0
  )

  return points
}

// https://adventofcode.com/2022/day/2#part2
export function day2part2 (roundsData: string[]): number {
    const rounds = roundsData.map(round)
    const points = rounds.reduce(
      (sum, round) => {
        const forOutcome = (round.shape2 === Shape.Rock) ? 0 : (round.shape2 === Shape.Paper ? 3 : 6)
        const result = possibeResults.find((result) => result.round.shape1 === round.shape1 && result.points2 === forOutcome);

        if (result === undefined) {
            throw new Error(`Unknown combination ${round.shape1 + round.shape2}`)
        }

        const forShape = pointsForShape(result.round.shape2);

        return sum + forOutcome + forShape;
      },
      0
    )
  
    return points  
}

function round (roundStr: string): Round {
  const [shape1, shape2] = roundStr.replace('X', 'A').replace('Y', 'B').replace('Z', 'C').split(' ') as Shape[]
  return { shape1, shape2 }
}

