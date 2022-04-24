import { getFocusedOption } from "./Utils";

describe("getFocusedOption", () => {
  // Testing options
  const optStr = { type: 3, name: "hello", value: "hi" };
  const optNum = { type: 4, name: "hello", value: 1234 };
  const optUsr = { type: 6, name: "hello", value: "??" };
  const optStrFocus = { ...optStr, focused: true };
  const optNumFocus = { ...optNum, focused: true };
  const optUsrFocus = { ...optUsr, focused: true };

  it("Returns undefined when there are no options", () => {
    expect(getFocusedOption([])).toBeUndefined();
  });

  it("Can get a focused string option", () => {
    expect(getFocusedOption([optNum, optStrFocus])).toBe(optStrFocus);
    expect(getFocusedOption([optStrFocus, optNum])).toBe(optStrFocus);
  });

  it("Can get a focused number option", () => {
    expect(getFocusedOption([optNumFocus, optStr])).toBe(optNumFocus);
    expect(getFocusedOption([optStr, optNumFocus])).toBe(optNumFocus);
  });

  it("Retrieves the first focused option if there are many", () => {
    expect(getFocusedOption([optNumFocus, optStrFocus])).toBe(optNumFocus);
    expect(getFocusedOption([optStrFocus, optNumFocus])).toBe(optStrFocus);
  });

  it("Ignores invalid/non-primitive options", () => {
    expect(getFocusedOption([optUsrFocus])).toBeUndefined();
    expect(getFocusedOption([optUsrFocus, optStrFocus])).toBe(optStrFocus);
    expect(getFocusedOption([optUsr, optStrFocus])).toBe(optStrFocus);
  });
});
