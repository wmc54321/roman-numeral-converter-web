import { InputError, INPUT_ERROR_KEY } from "./error-utils";

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


export function convertToRomanNumeral(rawOptStr: string | null, errorLoggingEventPrefix?: string): string {
  const errorLoggingEventForInvalidInput = errorLoggingEventPrefix + '.invalid_input'

  const rawOptStrTrim = rawOptStr != null ? rawOptStr.trim() : null;
  if (rawOptStrTrim == null || rawOptStrTrim === '') {
    throw new InputError(
      INPUT_ERROR_KEY.EMPTY_INPUT,
      errorLoggingEventForInvalidInput,
    );
  }

  // Number(null), Number(""), and Number("   ") will get 0 - which should have been filtered out above.
  const rawNumber = Number(rawOptStrTrim);
  if (Number.isNaN(rawNumber)) {
    throw new InputError(
      INPUT_ERROR_KEY.NOT_A_NUMBER,
      errorLoggingEventForInvalidInput,
    );
  }

  // check if the input is an integer.
  if (!Number.isInteger(rawNumber)) {
    throw new InputError(
      INPUT_ERROR_KEY.NOT_AN_INTEGER,
      errorLoggingEventForInvalidInput,
    );
  }

  // check if the input is within [1, 3999] - negative or zero
  if (rawNumber <= 0) {
    throw new InputError(
      INPUT_ERROR_KEY.NEGATIVE_OR_ZERO,
      errorLoggingEventForInvalidInput,
    );
  }

  // check if the input is within [1, 3999] - out of range
  if (rawNumber > 3999) {
    throw new InputError(
      INPUT_ERROR_KEY.EXCEEDS_SUPPORTED_RANGE,
      errorLoggingEventForInvalidInput,
    );
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