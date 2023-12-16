import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";

const timeLeftRe = /You have ([^s]+s) left to wait/;

export async function fetchDay(day: number) {
  const res = await fetch(`https://adventofcode.com/2023/day/${day}`, {
    headers: {
      Cookie: `session=${Deno.env.get("AOC_TOKEN")}`
    }
  });
  const parser = new DOMParser();
  const doc = parser.parseFromString(await res.text(), "text/html");

  const parts = [...(doc?.querySelectorAll(".day-desc") ?? [])];
  return parts.map((part, i) => `${colors.bgBrightBlue.white(`Part ${i + 1}`)}\n${part.textContent}`).join("\n\n");
}

export async function submitDay(day: number, level: 1 | 2, answer: string) {
  const body = new URLSearchParams({
    level: level.toString(),
    answer
  });
  const res = await fetch(`https://adventofcode.com/2023/day/${day}/answer`, {
    method: "POST",
    body,
    headers: {
      Cookie: `session=${Deno.env.get("AOC_TOKEN")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  const parser = new DOMParser();
  const doc = parser.parseFromString(await res.text(), "text/html");

  const articleText = doc?.querySelector("article")?.innerText ?? "";
  if (articleText.includes("That's not the right answer")) return { correct: false };

  const timeMatch = articleText.match(timeLeftRe);
  if (timeMatch) return { timeLeft: timeMatch[1] }
  
  return { correct: true };
}

// expires 2023, Path / HttpOnly .adventofcode.com Secure


export async function fetchDayInput(day: string) {
  const url = `https://adventofcode.com/2023/day/${day}/input`;
  const res = await fetch(url, {
    headers: {
      Cookie: `session=${Deno.env.get("AOC_TOKEN")}`
    }
  });
  return (await res.text()).trim();
}

