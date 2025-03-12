import {convertToRomanNumeral} from './server-utils';
import {INPUT_ERROR_KEY, INPUT_ERROR_MESSAGES, INPUT_ERROR_STATUS_CODE, InputError} from "./error-utils";

const INVALID_CASES: [string | null, INPUT_ERROR_KEY][] = [
  [null,          INPUT_ERROR_KEY.EMPTY_INPUT],
  ["",            INPUT_ERROR_KEY.EMPTY_INPUT],
  ["        ",    INPUT_ERROR_KEY.EMPTY_INPUT],
  ["null",        INPUT_ERROR_KEY.NOT_A_NUMBER],
  ["undefined",   INPUT_ERROR_KEY.NOT_A_NUMBER],
  ["NaN",         INPUT_ERROR_KEY.NOT_A_NUMBER],
  ["111b",        INPUT_ERROR_KEY.NOT_A_NUMBER],
  [" abcd  ",     INPUT_ERROR_KEY.NOT_A_NUMBER],
  ["999.00001",   INPUT_ERROR_KEY.NOT_AN_INTEGER],
  ["-999.00001",  INPUT_ERROR_KEY.NOT_AN_INTEGER],
  ["0",           INPUT_ERROR_KEY.NEGATIVE_OR_ZERO],
  ["-1",          INPUT_ERROR_KEY.NEGATIVE_OR_ZERO],
  ["4000",        INPUT_ERROR_KEY.EXCEEDS_SUPPORTED_RANGE],
  ["0xbeef",      INPUT_ERROR_KEY.EXCEEDS_SUPPORTED_RANGE],
];

const VALID_CASES: [string | null, string][] = [
  ["1",       "I"],
  ["3",       "III"],
  ["9",       "IX"],
  ["50",      "L"],
  ["58",      "LVIII"],
  ["99",      "XCIX"],
  ["245",     "CCXLV"],
  ["3999",    "MMMCMXCIX"],
  ["0xff",    "CCLV"],
  ["255.0",   "CCLV"],
  ["   255 ", "CCLV"],
]

function assertInvalidCase(value: string | null, expectedErrorKey: INPUT_ERROR_KEY) {
  let error;
  try {
    convertToRomanNumeral(value);
  }
  catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(InputError);
  if (error instanceof InputError) {
    expect(error.name).toBe(expectedErrorKey);
    expect(error.message).toBe(INPUT_ERROR_MESSAGES[expectedErrorKey]);
    expect(error.getStatusCode()).toBe(INPUT_ERROR_STATUS_CODE[expectedErrorKey]);
  }
}

describe('Test convertToRomanNumeral function', () => {
  it.each(INVALID_CASES)(
    "an invalid input %s should throw an error of %s",
    assertInvalidCase,
  );
  it.each(VALID_CASES)(
    "an valid input %s should return %s",
    (value, expectedResult) => expect(convertToRomanNumeral(value)).toBe(expectedResult),
  )
});