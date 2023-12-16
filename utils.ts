export function sum(arr: number[]): number {
  return arr.reduce((prev, curr) => prev + curr, 0)
}

export function memoize<T extends unknown[], R>(fn: (...args: T) => R): (...args: T) => R {
  const cache = new Map<string, R>();
  return (...args: T) => {
    const stringified = JSON.stringify(args);
    if (cache.has(stringified)) {
      return cache.get(stringified)!;
    }
    const result = fn(...args);
    cache.set(stringified, result);
    return result;
  }
}

export function toNumList(input: string, sep = ","): number[] {
  return input.split(sep).map(el => parseInt(el));
}

export function transpose(arr: string[]) {
  return Array(arr[0].length).fill(0).map((_, i) => arr.map(el => el[i]).join(""));
}