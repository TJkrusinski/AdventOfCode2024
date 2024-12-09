// https://adventofcode.com/2024/day/8

import assert from "node:assert";

// https://adventofcode.com/2024/day/8/input
const file = Deno.openSync('./december8/input.txt');

const buffer = new Uint8Array(file.statSync().size);

file.readSync(buffer);

const text = new TextDecoder().decode(buffer);

const lines = text.trim().split('\n');

const map: Array<Array<string>> = lines.map((line) => line.split(''));

const width = map[0].length;
const height = map.length;

assert(width === 12 || width === 50, "Width is not 12 or 50");
assert(height === 12 || height === 50, "Height is not 12 or 50");

type Antenna = {
  type: string;
  x: number;
  y: number;
};

const antennas: Array<Antenna> = [];

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const char = map[y][x];

    if (char !== '.') {
      antennas.push({ type: char, x, y });
    }
  }
}

if (width === 12) {
  // 7 antennas on the sample provided
  assert(antennas.length === 7, "Invalid number of antennas");
}

const scanAntennaForMatches = (antennas: Array<Antenna>, thisAntenna: Antenna): Array<Antenna> => {
  // we need to iterate through the map and find attenas that match

  const matchingAttennas: Array<Antenna> = [];

  for (const antenna of antennas) {
    if (antenna.type === thisAntenna.type) {
      // we have a match
      if (antenna.x !== thisAntenna.x && antenna.y !== thisAntenna.y) {
        matchingAttennas.push(antenna);
      }
    }
  }

  // will return a list of matching antennas
  return matchingAttennas;
};

const calculateDifference = (antenna1: Antenna, antenna2: Antenna): {x: number; y: number} => {
  const x = (antenna2.x - antenna1.x);
  const y = (antenna2.y - antenna1.y);

  return { x, y };
};

const antiNodes: Set<string> = new Set();

const validatePostion = (pos1: {x: number, y: number}, antenna1: Antenna, attenna2: Antenna): boolean => {
    if (pos1.x >= 0 && pos1.x < width && pos1.y >= 0 && pos1.y < height) {
      if (pos1.x !== antenna1.x && pos1.y !== antenna1.y) {
        if (pos1.x !== attenna2.x && pos1.y !== attenna2.y) {
          return true;
        }
      }
    }

    return false;
};

let hadMatch = 0;

for (const antenna of antennas) {
  const matches = scanAntennaForMatches(antennas, antenna);

  if (matches.length > 0) {
    hadMatch++;
  }

  for (const match of matches) {
    const difference = calculateDifference(antenna, match);

    const pos1 = {x : antenna.x + (difference.x * 2), y: antenna.y + (difference.y * 2)};

    const isValid1 = validatePostion(pos1, antenna, match);

    if (isValid1) {
      antiNodes.add(`${pos1.x},${pos1.y}`);
    }

  };
}

console.log(antiNodes.size);