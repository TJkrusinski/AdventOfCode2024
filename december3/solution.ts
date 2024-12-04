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
  d: (c: string) => c === 'd',
  o: (c: string) => c === 'o',
  apos: (c: string) => c === "'",
  t: (c: string) => c === 't',
  n: (c: string) => c === 'n',
};

let on = true;

type char = 'm' | 'u' | 'l' | '(' | 'd' | ',' | 'd2' | ')';

let expecting: char = 'm';
let current: char | '' = '';

type instruction = 'd' | 'o' | 't' | 'n' | '(' | ')' | '\'';

let iexpecting: instruction = 'd';
let icurrent: instruction | '' = '';

const flipOn = (b: boolean) => {
  on = b;
  console.log(`Flipping on to ${b}`);
}

for (const c of text) {
  if (on) {
    // we're looking to match don't()
    if (iexpecting === 'd' && is.d(c)) {
      icurrent += c;
      iexpecting = 'o';
    } else if (iexpecting === 'o' && is.o(c)) {
      icurrent += c;
      iexpecting = 'n';
    } else if (iexpecting === 'n' && is.n(c)) {
      icurrent += c;
      iexpecting = '\'';
    } else if (iexpecting === '\'' && is.apos(c)) {
      icurrent += c;
      iexpecting = 't';
    } else if (iexpecting === 't' && is.t(c)) {
      icurrent += c;
      iexpecting = '(';
    } else if (iexpecting === '(' && is.openParanthesis(c)) {
      icurrent += c;
      iexpecting = ')';
    } else if (iexpecting === ')' && is.closeParanthesis(c)) {
      flipOn(false);
      icurrent = '';
      iexpecting = 'd';
    } else {
      if (c === 'd') {
        icurrent = c as instruction;
        iexpecting = 'o';
      } else {
        icurrent = '';
        iexpecting = 'd';
      }
    }
  } else if (on === false) {
    // we're off so we're looking to match do()
    if (iexpecting === 'd' && is.d(c)) {
      icurrent += c;
      iexpecting = 'o';
    } else if (iexpecting === 'o' && is.o(c)) {
      icurrent += c;
      iexpecting = '(';
    } else if (iexpecting === '(' && is.openParanthesis(c)) {
      icurrent += c;
      iexpecting = ')';
    } else if (iexpecting === ')' && is.closeParanthesis(c)) {
      flipOn(true);
      icurrent = '';
      iexpecting = 'd';
    } else {
      if (c === 'd') {
        icurrent = c as instruction;
        iexpecting = 'o';
      } else {
        icurrent = '';
        iexpecting = 'd';
      }
    }
  }

  if (on) {
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
      expecting = 'd2';
    } else if (expecting === 'd2' && is.digit2(c)) {
      current += c;
    } else if (expecting === 'd2' && is.closeParanthesis(c)) {
      current += c;
      validMuls.push(current);
      current = '';
      expecting = 'm';
    } else {
      if (c === 'm') {
        current = c as char;
        expecting = 'u';
      } else {
        current = '';
        expecting = 'm';
      }
    }
  }
}

// now we need to refine the validMuls
// and remove the ones that are not valid
// we can use regex for this
// we can use the following regex
// mul\(\d+,\d+\)

const newValidMuls: Array<string> = validMuls.filter((mull) => /mul\(\d+,\d+\)/.test(mull));

const parseMullAndMultiply = (mull: string): number => {
  if (mull[mull.length - 1] !== ')') {
    throw new Error('Invalid mull');
  }

  if (mull.indexOf('mul(') !== 0) {
    throw new Error('Invalid mull');
  }
  
  const firstParse = mull.slice(4, mull.length - 1);
  const split = firstParse.split(',');
  const first = parseInt(split[0], 10);
  const second = parseInt(split[1], 10);
  return first * second;
};

let total = 0;

for (const mull of newValidMuls) {
  total += parseMullAndMultiply(mull);
}

console.log(total);