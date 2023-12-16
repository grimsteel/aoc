import { sum, transpose } from "../utils.ts";

/** returns true if there's exactly one difference between the two strings */
function onlyOneDiff(a: string, b: string) {
  if (!a || !b) return false;
  let usedDiff = false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (usedDiff) return false;
      else usedDiff = true;
    }
  }

  return usedDiff;
}

function findAxis(lines: string[]) {
  let possibleRowAxis = -1;
  for (let i = 0; i < lines.length; i++) {
    if (possibleRowAxis === -1) {
      if (lines[i] === lines[i - 1]) {
        possibleRowAxis = i;
      }
    } else {
      const otherLine = lines[i - (i - possibleRowAxis) * 2 - 1]
      if (!otherLine) break;
      if (lines[i] !== otherLine) possibleRowAxis = -1;
    }
  }

  return possibleRowAxis;
}

function findAxis2(lines: string[]) {
  let axes: { c: boolean; i: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === lines[i - 1] || onlyOneDiff(lines[i], lines[i - 1])) {
      // Found a possible symmetry axis (could have a smudge, which will be taken care of in the filter() below)
      axes.push({ i, c: false });
    }
    axes = axes.filter(item => {
      // Opposite of the axis
      const otherLine = lines[i - (i - item.i) * 2 - 1];
      if (!otherLine) return true;
      if (lines[i] === otherLine) return true;
      if (!item.c && onlyOneDiff(lines[i], otherLine)) {
        item.c = true;
        return true;
      }
      return false;
    });
  }

  // Find the axis which we used a smudge for
  return axes.find(el => el.c)?.i ?? -1;
}

function one([input]: string[]): number {
  const items = input.split(/\r?\n\r?\n/).map(el => {
    const lines = el.split(/\r?\n/);
    const possibleRowAxis = findAxis(lines);
    if (possibleRowAxis !== -1) return 100 * possibleRowAxis;
    const colAxis = findAxis(transpose(lines));
    return colAxis;
  });

  return sum(items);
}

function two([input]: string[]): number {
  const items = input.split(/\r?\n\r?\n/).map(el => {
    const lines = el.split(/\r?\n/);
    const possibleRowAxis = findAxis2(lines);
    if (possibleRowAxis !== -1) return 100 * possibleRowAxis;
    const colAxis = findAxis2(transpose(lines));
    return colAxis;
  });

  return sum(items);
}

export default {
  one, two,
  sample: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
dontSplit: true
}