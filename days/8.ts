const lineRe = /(\w{3}) = \((\w{3}), (\w{3})\)/;

function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  // Euclidian alg: gcd of a and b (a > b) is gcd of a and b mod a
  const aModB = a % b;
  return gcd(b, aModB);
}

function gcdNs(a: number, b: number): number {
  if (a === b) return a;
  return a > b ? gcd(a, b) : gcd(b, a);
}

function lcm(a: number, b: number) {
  return Math.abs(a * b) / gcdNs(a, b);
}

function lcm3p(numbers: number[]): number {
  let rollingLcm = lcm(numbers.pop()!, numbers.pop()!);
  
  while (numbers.length > 0) {
    rollingLcm = lcm(numbers.pop()!, rollingLcm);
  }
  return rollingLcm;
}

function numSteps(itemMap: Map<string, [string, string]>, sequence: (0 | 1)[], startItem: string) {
  let currentItem = startItem;
  let count = 0;
  let i = 0;
  while(true) {
    count++;
    currentItem = itemMap.get(currentItem)![sequence[i]];

    if (currentItem.endsWith("Z")) return count;

    // wrap around
    if (++i >= sequence.length) i = 0;
  }
}

function one(input: string[]): number {
  const itemMap = new Map<string, [string, string]>();
  
  // Map the L/R instructions to an array of 0s and 1s
  const sequence = input.shift()!.split("").map(direction => direction === "L" ? 0 : 1);
  input.shift(); // remove blank line

  for (const line of input) {
    const [, node, left, right] = line.match(lineRe)!;
    itemMap.set(node, [left, right]);
  }

  return numSteps(itemMap, sequence, "AAA");
}

function two(input: string[]): number {
  const itemMap = new Map<string, [string, string]>();

  // Map the L/R instructions to an array of 0s and 1s
  const sequence = input.shift()!.split("").map(direction => direction === "L" ? 0 : 1);
  input.shift(); // remove blank line

  let currentItems: string[] = [];
  
  for (const line of input) {
    const [, node, left, right] = line.match(lineRe)!;
    itemMap.set(node, [left, right]);
    if (node.endsWith("A")) currentItems.push(node);
  }

  // Note: We assume that each start node maps to exactly one end node, and vice versa.
  // Therefore, each path will keep repeating(?)
  const individualTimes = currentItems.map(item => numSteps(itemMap, sequence, item));
  return lcm3p(individualTimes);
}

export default {
  one, two,
  sample: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`
}