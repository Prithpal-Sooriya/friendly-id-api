import NOUNS from './nouns/short-nouns.json'

const PREFIX = "MM";
const MAX_TOTAL = 25;
const SEPARATOR = "-";
const SALT_LENGTH = 3;

function generateSalt(): string {
  const arr = crypto.getRandomValues(new Uint16Array(1));
  const num = (arr.at(0) ?? 0) % Math.pow(10, SALT_LENGTH);
  return num.toString().padStart(SALT_LENGTH, "0");
}

export function generateId(): string {
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const salt = generateSalt();
  const id = `${PREFIX}${SEPARATOR}${noun}${SEPARATOR}${salt}`;
  return id;
}

export const isMaxIdLength = (id: string) => id.length <= MAX_TOTAL

export const MAX_IDS = NOUNS.length * Math.pow(10, SALT_LENGTH);
