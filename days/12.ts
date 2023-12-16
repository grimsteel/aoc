export function doRow(record: string[], check: number[]): number {
  let count = 0;
  let state = {
    needNums: [...check],
    numBroken: 0,
    cPos: 0,
    record
  };

  const decisions: (typeof state)[] = [];

  while (true) {
    let goBack = false;

    if (state.record[state.cPos] === "?") {
      state.record[state.cPos] = "#";
      decisions.push(structuredClone(state));
    }
    
    switch (state.record[state.cPos]) {
      case ".":
        if (state.numBroken > 0) {
          if (state.numBroken !== state.needNums[0]) {
            goBack = true;
          } else {
            state.needNums.shift();
            state.numBroken = 0;
          }
        }
        break;
      case "#":
        state.numBroken++;
        if (state.numBroken > state.needNums[0]) {
          goBack = true;
        }
        break;
    }

    // At the end
    if (state.cPos === state.record.length - 1) {
      // Handle any things that need to end now
      if (state.numBroken === state.needNums[0]) {
        state.needNums.shift();
        state.numBroken = 0;
      }
      if (state.needNums.length === 0 && state.numBroken === 0) {
        count++;
      }
      goBack = true;
    }
    
    if (goBack) {
      // There's a conflict. Go back to the last decision point
      const lastDecision = decisions.pop()
      if (!lastDecision) return count; 
      state = lastDecision;
      // Now we need to change the current pos thing to a "."
      state.record[state.cPos] = ".";
    } else {
      state.cPos++;
    }
  }
}

function one(input: string[]): number {
  const rows = input.map(el => {
    const [record, check] = el.split(" ");
    const parsedCheck = check.split(",").map(el => parseInt(el));
    return doRow(record.split(""), parsedCheck);
  });

  return rows.reduce((acc, cur) => cur + acc, 0);
}

export default {
  one, 
  sample: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`
}