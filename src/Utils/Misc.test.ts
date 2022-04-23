import { areArraysEqualSets, sleep } from "./Misc";

describe("sleep", () => {
  const marginOfError = 10;
  const currentTime = "performance" in globalThis ? performance.now : Date.now;

  it("Sleeps for a second", async () => {
    const time = currentTime();
    await sleep(1000);
    const time2 = currentTime();

    expect(time2 - time).toBeGreaterThanOrEqual(1000);
    expect(time2 - time).toBeLessThan(1000 + marginOfError);
  });
});

describe("areArraysEqualSets", () => {
  // These should all be true

  it("Can identify two arrays as equal", () => {
    const result = areArraysEqualSets([1, 2, 3], [1, 2, 3]);
    expect(result).toBe(true);
  });

  it("Can identify two mixed arrays as equal", () => {
    const result = areArraysEqualSets([1, "2", BigInt(3)], [1, "2", BigInt(3)]);
    expect(result).toBe(true);
  });

  it("Can identify two unsorted mixed arrays as equal", () => {
    const result = areArraysEqualSets(["2", 1, BigInt(3)], [BigInt(3), "2", 1]);
    expect(result).toBe(true);
  });

  it("Can identify two unsorted arrays of objects as equal", () => {
    const result = areArraysEqualSets([{ hey: "hi" }], [{ hey: "hi" }]);
    expect(result).toBe(true);
  });

  // These should all be false

  it("Can identify two arrays as not equal", () => {
    const result = areArraysEqualSets([1, 2, 3], [4, 5, 6]);
    expect(result).toBe(false);
  });

  it("Can identify two mixed arrays as not equal", () => {
    const result = areArraysEqualSets([1, "2", BigInt(3)], [4, "5", BigInt(6)]);
    expect(result).toBe(false);
  });

  it("Can identify two unsorted mixed arrays as not equal", () => {
    const result = areArraysEqualSets(["1", 2, BigInt(3)], [BigInt(1), "2", 3]);
    expect(result).toBe(false);
  });

  it("Can identify two unsorted arrays of objects as not equal", () => {
    const result = areArraysEqualSets([{ hey: "hi" }], [{ hey: "ho" }]);
    expect(result).toBe(false);
  });
});
