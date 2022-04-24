import { getFocused } from "./Utils";

describe("getFocused", () => {
  // Testing options
  const optStr = { type: 3, name: "hello", value: "hi" };
  const optNum = { type: 4, name: "hello", value: 1234 };
  const optUsr = { type: 6, name: "hello", value: "??" };
  const optStrFocus = { ...optStr, focused: true };
  const optNumFocus = { ...optNum, focused: true };
  const optUsrFocus = { ...optUsr, focused: true };

  it("Returns undefined when there are no options", () => {
    expect(getFocused([])).toBeUndefined();
  });

  it("Can get a focused string option", () => {
    expect(getFocused([optNum, optStrFocus])).toBe(optStrFocus.name);
    expect(getFocused([optStrFocus, optNum])).toBe(optStrFocus.name);
  });

  it("Can get a focused number option", () => {
    expect(getFocused([optNumFocus, optStr])).toBe(optNumFocus.name);
    expect(getFocused([optStr, optNumFocus])).toBe(optNumFocus.name);
  });

  it("Retrieves the first focused option if there are many", () => {
    expect(getFocused([optNumFocus, optStrFocus])).toBe(optNumFocus.name);
    expect(getFocused([optStrFocus, optNumFocus])).toBe(optStrFocus.name);
  });

  it("Ignores invalid/non-primitive options", () => {
    expect(getFocused([optUsrFocus])).toBeUndefined();
    expect(getFocused([optUsrFocus, optStrFocus])).toBe(optStrFocus.name);
    expect(getFocused([optUsr, optStrFocus])).toBe(optStrFocus.name);
  });
});
