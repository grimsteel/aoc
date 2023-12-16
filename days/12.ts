import { memoize, sum, toNumList } from "../utils.ts";

const doRow = memoize((record: string, check: number[]): number => {
  // Check to see if there are enough spaces to fit the check
  // Note: there are check.length - 1 spaces between the numbers
  if (record.length < sum(check) + check.length - 1) return 0;

  if (check.length === 0) {
    // If there are more "#"s in the record but no checks left, not possible
    if (record.indexOf("#") !== -1) return 0;
    // Otherwise, it's possible
    return 1;
  }

  // If there first char is a ".", then we can just skip it
  if (record[0] === ".") {
    return doRow(record.slice(1), check);
  }

  // If it's "#", see if we can fit it.
  // If the next check is of length 3, basically match it on a regex of /^[#\?]{3}[\?\.$]/, because ?s can function as a # or a  (the end of the string also works as a boundary)
  if (record[0] === "#") {
    const regex = new RegExp(`^[#\?]{${check[0]}}($|[\?\.])`);
    // If we can't match it, not possible
    if (!record.match(regex)) {
      return 0;
    } else {
      return doRow(record.slice(check[0] + 1), check.slice(1));
    }
  }

  // If it's a "?", just try both
  return doRow("#" + record.slice(1), check) + doRow("." + record.slice(1), check);
});

function one(input: string[]): number {
  const rows = input.map(el => {
    const [record, check] = el.split(" ");
    return doRow(record, toNumList(check));
  });

  return sum(rows);
}

function two(input: string[]): number {
  const rows = input.map(el => {
    const [record, check] = el.split(" ");
    const parsedCheck = toNumList(check);
    return doRow([record, record, record, record, record].join("?"), parsedCheck.concat(parsedCheck).concat(parsedCheck).concat(parsedCheck).concat(parsedCheck));
  });

  return sum(rows)
}

export default {
  one, two,
  sample: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`
}