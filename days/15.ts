import { sum } from "../utils.ts";

function hash(str: string) {
  let current = 0;
  str.split("").forEach(char => {
    current += char.charCodeAt(0);
    current = (current << 4) + current; // * 17
    current = current & 255; // mod 256
  });
  return current;
}

function one(input: string[]) {
  return sum(input.join("").split(",").map(hash));
}

function two(input: string[]) {
  const items = input.join("").split(",");

  // Array of map of label to focal length
  const boxes = Array(256).fill(0).map(() => new Map<string, number>());

  items.forEach(item => {
    const [, label, action, length] = item.match(/(\w+)([=-])(\d*)/)!;
    const box = boxes[hash(label)];
    if (action === "=") {
      box.set(label, parseInt(length));
    } else {
      box.delete(label);
    }
  });

  return sum(boxes.map((box, i) => {
    if (box.size === 0) return 0;
    // Sum the focal powers
    let totalFocalPower = 0;
    let j = 1;
    for (const power of box.values()) {
      totalFocalPower += power * j;
      j++;
    }
    return (i + 1) * totalFocalPower
  }));
}

export default {
  one, two,
  sample: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`
}