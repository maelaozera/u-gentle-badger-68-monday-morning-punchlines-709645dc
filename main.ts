// Monday Morning Punchlines — u-gentle-badger-68-monday-morning-punchlines-709645dc
//
// Writes a single Monday-morning joke (at most 200 characters, one line)
// to /output/entry.txt, as the competition kit requires.
//
// The joke: the bed takes the alarm to court. It is specific to Monday
// morning, it has a real turn (a restraining order, then siding with the
// bed), it says it in few words, and it avoids the tired "I hate Mondays"
// complaint and the plain snooze-button gag.
//
// Structure: the entry text lives in one constant, the competition rules
// live in a small config object, each rule is enforced by its own tiny
// validator, and `main` ties validation and writing together. Splitting
// the checks apart makes it obvious which rule failed, instead of hiding
// every failure inside one big function.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// ---------------------------------------------------------------------------
// Entry text and competition rules
// ---------------------------------------------------------------------------

// The one-liner itself. Keep it exactly as written: the wording, the
// comma placement, and the final period are part of the entry.
const JOKE =
  "My bed filed a restraining order against my Monday alarm, and honestly, I'm testifying for the bed.";

// Everything the competition requires of the entry, in one place so a
// rule change only needs one edit.
const RULES = {
  maxChars: 200,
  minChars: 1,
  outputPath: "/output/entry.txt",
} as const;

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

// Count characters the way a reader sees them (code points, not UTF-16
// units), so an emoji or accented letter counts as one character.
function countChars(text: string): number {
  return [...text].length;
}

// The entry must be non-empty and fit inside the competition's length cap.
function validateLength(text: string): void {
  const length = countChars(text);
  if (length < RULES.minChars || length > RULES.maxChars) {
    throw new Error(
      `Entry must be ${RULES.minChars} to ${RULES.maxChars} characters, got ${length}.`,
    );
  }
}

// A line of only spaces is not a joke, even if it passes the length check.
function assertNotBlank(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only whitespace.");
  }
}

// The competition wants exactly one line: no newline characters anywhere.
function assertSingleLine(text: string): void {
  if (text.includes("\n")) {
    throw new Error("Entry must be a single line.");
  }
}

// Run every rule in order. Each helper above reports its own failure, so
// a bad entry points straight at the rule it broke.
function validateLine(text: string): void {
  validateLength(text);
  assertNotBlank(text);
  assertSingleLine(text);
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

// Create the output directory if needed, then write the validated entry
// verbatim — no trailing newline, no extra formatting.
function writeEntry(path: string, text: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, "utf8");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  // Validate first so a bad entry never reaches the output file.
  validateLine(JOKE);
  writeEntry(RULES.outputPath, JOKE);
}

main();
