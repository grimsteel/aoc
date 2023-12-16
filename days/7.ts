/* camel cards */

type Item = { o: string, b: number, r: number }

const itemRanks = {
  "T": 10,
  "J": 11,
  "Q": 12,
  "K": 13,
  "A": 14
};

const itemRanks2 = {
  "T": 10,
  "J": 1,
  "Q": 11,
  "K": 12,
  "A": 13
};

function sortFunction(ranks: typeof itemRanks, a: Item, b: Item) {
  // negative if A is less than B
  // positive if A is greater than B
  
  const rankDiff = a.r - b.r;
  if (rankDiff !== 0) return rankDiff;

  for (let i = 0; i < a.o.length; i++) {
    const aItemRank = parseInt(a.o[i]) || ranks[a.o[i] as keyof typeof ranks];
    const bItemRank = parseInt(b.o[i]) || ranks[b.o[i] as keyof typeof ranks];
    const itemRankDiff = aItemRank - bItemRank;
    if (itemRankDiff !== 0) return itemRankDiff;
  }

  return 0;
}

function rank(item: string, jokers = false) {
  const counts: Record<string, number> = {};
  item.split("").forEach(letter => {
    if (!counts[letter]) counts[letter] = 1;
    else counts[letter]++;
  });
  let twos = 0;
  let three = false;
  let four = false;
  let five = false;

  if (jokers) {
    const jokers = counts["J"] ?? 0;
    delete counts["J"];

  
    const maxItem = { v: 0, k: null as string | null }
  
    Object.entries(counts).forEach(([k,v]) => {
      if (v > maxItem.v) {
        maxItem.v = v;
        maxItem.k = k;
      }
    });
  
    counts[maxItem.k as string] = Math.min(5, maxItem.v + jokers);
    
  }
  
  Object.entries(counts).forEach(([_letter, count]) => {
    if (count === 2) twos++;
    else if (count === 3) three = true;
    else if (count === 4) four = true;
    else if (count === 5) five = true;
  });

  if (five) return 7; // five of a kind
  else if (four) return 6; // four of a kind
  else if (three && twos === 1) return 5; // full house
  else if (three) return 4; // three of a kind
  else if (twos === 2) return 3; // two pair
  else if (twos === 1) return 2; // one pair
  else return 0; // high card
}

function one(input: string[]): number {
  const sorted = (
                  input.map(el => el.split(" "))
                  .map(el => ({ o: el[0], b: parseInt(el[1]), r: rank(el[0]) })))
    .sort(sortFunction.bind(null, itemRanks))

  // multiply card bids by ranks
  const total = sorted.reduce((acc, cur, i) => acc + cur.b * (i + 1), 0);
  return total;
}

function two(input: string[]): number {
  const sorted = (
    input.map(el => el.split(" "))
    .map(el => ({ o: el[0], b: parseInt(el[1]), r: rank(el[0], true) })))
  .sort(sortFunction.bind(null, itemRanks2))

  // multiply card bids by ranks
  const total = sorted.reduce((acc, cur, i) => acc + cur.b * (i + 1), 0);
  return total;
}

export default {
  one, two,
  sample: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`
};