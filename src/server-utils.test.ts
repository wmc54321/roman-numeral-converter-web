import * as ServerUtils from './server-utils.ts';

describe('Test convertToRomanNumeral function', () => {
  it('should throw errors for invalid inputs', () => {
    expect(() => ServerUtils.convertToRomanNumeral("")).toThrow(
      "Input is not a valid Arabic numeral."
    )
    expect(() => ServerUtils.convertToRomanNumeral("111b")).toThrow(
      "Input is not a valid Arabic numeral."
    )
    expect(() => ServerUtils.convertToRomanNumeral("999.00001")).toThrow(
      "Input is not an integer."
    )
    expect(() => ServerUtils.convertToRomanNumeral("0")).toThrow(
      "Input is not within [1, 3999]."
    )
    expect(() => ServerUtils.convertToRomanNumeral("-1")).toThrow(
      "Input is not within [1, 3999]."
    )
    expect(() => ServerUtils.convertToRomanNumeral("4000")).toThrow(
      "Input is not within [1, 3999]."
    )
  })

  it('should return the correct roman number', () => {
    expect(ServerUtils.convertToRomanNumeral("1")).toBe("I");
    expect(ServerUtils.convertToRomanNumeral("3")).toBe("III");
    expect(ServerUtils.convertToRomanNumeral("9")).toBe("IX");
    expect(ServerUtils.convertToRomanNumeral("50")).toBe("L");
    expect(ServerUtils.convertToRomanNumeral("58")).toBe("LVIII");
    expect(ServerUtils.convertToRomanNumeral("99")).toBe("XCIX");
    expect(ServerUtils.convertToRomanNumeral("245")).toBe("CCXLV");
    expect(ServerUtils.convertToRomanNumeral("3999")).toBe("MMMCMXCIX");
  });

});