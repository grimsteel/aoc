import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/mod.ts";
import { Select, Toggle, Number, Input } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { walk } from "https://deno.land/std@0.208.0/fs/mod.ts";
import { fetchDayInput, fetchDay, submitDay } from "./fetch-day.ts";

type DayExports = {
  one: (input: string[]) => number,
  two?: (input: string[]) => number,
  sample: string,
  dontSplit?: boolean
};

console.log(colors.brightGreen.bold("AOC Playground:\n"));

async function exec() {
  const daysSupported: string[] = [];
    
  for await (const file of walk("./days")) {
    if (!file.isFile) continue;
    const [dayId] = file.name.split(".");
    daysSupported.push(dayId);
  }
  
  
  const selectedDay = await Select.prompt({
    message: "Pick a day",
    options: daysSupported
  });
  
  const selectedDayExports: DayExports = (await import(`./days/${selectedDay}.ts`)).default;
  
  let partToRun = selectedDayExports.one;
  
  if (selectedDayExports.two) {
    const runPartTwo = await Toggle.prompt({
      active: "Two",
      inactive: "One",
      message: "Pick part",
      default: false
    });
  
    if (runPartTwo) partToRun = selectedDayExports.two;
  }
  
  const inputType = await Toggle.prompt({
    active: "Real",
    inactive: "Sample",
    message: "Pick input type",
    default: false
  });

  const rawInput = inputType ? await fetchDayInput(selectedDay) : selectedDayExports.sample;
  const input = selectedDayExports.dontSplit ? [rawInput] : rawInput.split(/\r?\n/);
  
  console.log(partToRun(input));
}

async function viewInstructions() {
  const day = await Number.prompt({ message: "What day?", min: 0, max: 25 });
  console.log();
  console.log(await fetchDay(day));
}

async function submit() {
  const day = await Number.prompt({ message: "What day?", min: 0, max: 25 });
  const level = (await Toggle.prompt({ message: "What level?", active: "Two", inactive: "One" })) ? 2 : 1;
  const answer = await Input.prompt("Answer")

  const result = await submitDay(day, level, answer);
  if (result.timeLeft) {
    console.log(colors.brightYellow.italic(`Please wait ${result.timeLeft} before retrying`));
  } else if (result.correct) {
    console.log(colors.brightGreen("Correct!"));
  } else {
    console.log(colors.brightRed("Incorrect"));
  }
}

const action = await Select.prompt({
  message: "Pick action",
  options: [{ value: 0, name: "Exec Code" }, { value: 1, name: "View Instructions" }, { value: 2, name: "Submit" }]
});

switch (action) {
  case 0:
    await exec();
    break;
  case 1:
    await viewInstructions();
    break;
  case 2:
    await submit();
    break;
}