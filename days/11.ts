

function one(input: string[], space = 1): number {
  const galaxyPositions: [number, number][] = [];
  const colToGalaxyMap = new Map<number, [number, number][]>();

  let numRowsWithoutGalaxy = 0;

  input.forEach((row, y) => {
    let hasGalaxy = false;
    row.split("").forEach((item, x) => {
      if (item === "#") {
        const galaxy = [y + numRowsWithoutGalaxy * space, x] as [number, number];
        galaxyPositions.push(galaxy);

        // Update map of col index to galaxy
        const colList = colToGalaxyMap.get(galaxy[1]);
        if (colList) colList.push(galaxy);
        else colToGalaxyMap.set(galaxy[1], [galaxy]);
        
        hasGalaxy = true;
      }
    });

    if (!hasGalaxy) numRowsWithoutGalaxy++;
  });

  // Still need to expand in x-direction
  let numColsWithoutGalaxy = 0;
  for (let x = 0; x < input[0].length; x++) {
    if (colToGalaxyMap.has(x)) {
      // If this col has a galaxy, update all the positions
      colToGalaxyMap.get(x)!.forEach(item => item[1] += numColsWithoutGalaxy * space);
    } else {
      numColsWithoutGalaxy++;
    }
  }

  let total = 0;

  // All combinations
  /*
    0 1 2 3 4
  0   x x x x
  1     x x x
  2       x x
  3         x
  4



  for i from 1 to 4 inclusive, 

    for j from 0 to i exclusive
  */
  for (let i = 1; i < galaxyPositions.length; i++) {
    const f = galaxyPositions[i];
    for (let j = 0; j < i; j++) {
      const s = galaxyPositions[j];
      const dis = Math.abs(f[0] - s[0]) +
          Math.abs(f[1] - s[1]);
      total += dis;
    }
  }

  return total;
}

export default {
  one, two: (input: string[]) => one(input, 999_999),
  sample: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`
}