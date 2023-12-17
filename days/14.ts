import { rotateRight } from "../utils.ts";

function moveNorth(input: string[][]) {
  const newInput: string[][] = [];
  const blockPositions: number[] = Array(input[0].length).fill(-1);
  for (let i = 0; i < input.length; i++) {
    newInput[i] = [];
    input[i].forEach((el, j) => {
      if (el === "#") {
        blockPositions[j] = i;
        newInput[i][j] = "#";
      } else if (el === "O") {
        // How far can we slide it up?
        const blockPosition = blockPositions[j];
        const newPosition = blockPosition + 1;
        blockPositions[j] = newPosition;
        newInput[i][j] = "."
        newInput[newPosition][j] = "O";
      } else {
        newInput[i][j] = ".";
      }
    });
  }
  return newInput;
}

const cycle = (input: string[][]) => {
  let _input = input;
  for (let i = 0; i < 4; i++) {
    _input = rotateRight(moveNorth(_input));
  }
  return _input;
};


function one(input: string[]) {
  const blockPositions = Array(input[0].length).fill(-1);
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    input[i].split("").forEach((el, j) => {
      if (el === "#") blockPositions[j] = i;
      else if (el === "O") {
        // How far can we slide it up?
        const blockPosition = blockPositions[j];
        const newPosition = blockPosition + 1;
        blockPositions[j] = newPosition;

        total += input.length - newPosition;
      }
    });
  }
  return total;
}

function two(input: string[]) {
  let result = input.map(el => el.split(""));
  const resultsIndex = new Map<string, number>();
  const results: string[][][] = [];
  for (let i = 0; i < 1000000000; i++) {
    const str = JSON.stringify(result);
    if (resultsIndex.has(str)) {
      const index = resultsIndex.get(str)!;
      const cycleLength = i - index;
      // Calculate the offset in the cycle the end one will be
      const numLeft = (1000000000 - 1) - i;
      const endIndex = index + numLeft % cycleLength;
      result = results[endIndex];
      break;
    }
    result = cycle(result);
    resultsIndex.set(str, results.length);
    results.push(result);
  }
  let total = 0;
  for (let i = 0; i < result.length; i++) {
    total += (result.length - i) * result[i].filter(el => el === "O").length;
  }
  
  return total;
}

export default {
  one, two,
  sample: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`
}