import type { FermentEntry } from "../types";

export default function generateFermentName() {
  /** Randomly generate a ferment name when one is not provided:
  * 1. Starts with an uppercase alpha character
  * 2. Ends with a 3 digit numeric
  */

  const stored = localStorage.getItem('fermentData');
  const parsed: FermentEntry[] = stored ? JSON.parse(stored) : [];
  const existingNames = new Set(parsed.map(entry => entry.fermentName));

  let name;
  do {
    name = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(100 + Math.random() * 900).toString();
  } while (existingNames.has(name));

  return name;
}