
const DECREASING_INT_TO_ROMAN_PAIRS: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function convertToRomanNumeral(rawStr: string): string {
  // check if the input is in format of "Arabic numeral".
  if (!rawStr || isNaN(Number(rawStr))) {
    throw new Error("Input is not a valid Arabic numeral.");
  }

  const rawNumber = Number(rawStr);
  // check if the input is an integer.
  if (!Number.isInteger(rawNumber)) {
    throw new Error("Input is not an integer.");
  }

  // check if the input is within [1, 3999]
  if (rawNumber < 1 || rawNumber > 3999) {
    throw new Error("Input is not within [1, 3999].");
  }

  // Okay! convert to roman numeral now.

  let numForIteration = rawNumber;
  let romanNumeral = "";
  // iterate from high to low
  DECREASING_INT_TO_ROMAN_PAIRS.forEach(
    ([pNumber, pSymbol]) => {
      while (numForIteration >= pNumber) {
        romanNumeral += pSymbol;
        numForIteration -= pNumber;
      }
    }
  )

  return romanNumeral;
}