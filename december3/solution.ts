// https://adventofcode.com/2024/day/3

// https://adventofcode.com/2024/day/3/input
const file = Deno.openSync('./december3/input.txt');

const buffer = new Uint8Array(file.statSync().size);

file.readSync(buffer);

const text = new TextDecoder().decode(buffer);
const validMuls: Array<string> = [];

const is = {
  m: (c: string) => c === 'm',
  u: (c: string) => c === 'u',
  l: (c: string) => c === 'l',
  openParanthesis: (c: string) => c === '(',
  digit: (c: string) => /\d/.test(c),
  comma: (c: string) => c === ',',
  digit2: (c: string) => /\d/.test(c),
  closeParanthesis: (c: string) => c === ')',
};

type char = 'm' | 'u' | 'l' | '(' | 'd' | ',' | 'd2' | ')';

let expecting: char = 'm';
let current: char | '' = '';

for (const c of text) {
  if (expecting === 'm' && is.m(c)) {
    current += c;
    expecting = 'u';
  } else if (expecting === 'u' && is.u(c)) {
    current += c;
    expecting = 'l';
  } else if (expecting === 'l' && is.l(c)) {
    current += c;
    expecting = '(';
  } else if (expecting === '(' && is.openParanthesis(c)) {
    current += c;
    expecting = 'd';
  } else if (expecting === 'd' && is.digit(c)) {
    current += c;
  } else if (expecting === 'd' && is.comma(c)) {
    current += c;
    expecting = 'd';
  } else if (expecting === 'd' && is.closeParanthesis(c)) {
    current += c;
    validMuls.push(current);
    current = '';
    expecting = 'm';
  }
}

// now we need to refine the validMuls
// and remove the ones that are not valid
// we can use regex for this
// we can use the following regex
// mul\(\d+,\d+\)

const newValidMuls: Array<string> = validMuls.filter((mull) => /mul\(\d+,\d+\)/.test(mull));

console.log(newValidMuls.length, text.length);


const parseMullAndMultiply = (mull: string): number => {
  const firstParse = mull.slice(4, mull.length - 1);
  const split = firstParse.split(',');
  const first = parseInt(split[0]);
  const second = parseInt(split[1]);
  return first * second;
};

let total = 0;

for (const mull of newValidMuls) {
  total += parseMullAndMultiply(mull);
}

console.log(total);