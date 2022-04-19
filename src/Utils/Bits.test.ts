import { Bits } from "./Bits";

describe("Utils/Bits", () => {
  describe("Utils/Bits/Statics", () => {
    // Conversion
    // These come first as next methods will call the conversion themselves also.

    it("Can convert properly", () => {
      expect(Bits.toBit("123")).toBe(BigInt(123));
    });

    it("Can convert from number to bits", () => {
      expect(Bits.toBit(123)).toBe(BigInt(123));
    });

    it("Can convert from array to bits", () => {
      expect(Bits.toBit([123, 456])).toBe(BigInt(123) | BigInt(456));
    });

    it("Can convert from mixed array to bits", () => {
      expect(Bits.toBit(["123", 456])).toBe(BigInt(123) | BigInt(456));
    });

    // Addition

    it("Can add two bits together", () => {
      expect(Bits.add(123, 456)).toBe(BigInt(123) | BigInt(456));
    });

    it("Can add multiple bits together", () => {
      expect(Bits.add(12, 34, 56)).toBe(BigInt(12) | BigInt(34) | BigInt(56));
    });

    // Assertion

    it("Can assert whether a bit has another bit", () => {
      // 1 = 00000000000000000000000000000001 <- true
      expect(Bits.has(1, 1)).toBe(true);
      // 3 = 00000000000000000000000000000011 <- true
      expect(Bits.has(3, 1)).toBe(true);
      // 5 = 00000000000000000000000000000101 <- true
      expect(Bits.has(5, 1)).toBe(true);
      // 6 = 00000000000000000000000000000110 <- false
      expect(Bits.has(6, 1)).toBe(false);
    });
  });

  let bits: Bits;
  beforeEach(() => (bits = new Bits(5)));

  it("Can add bits to itself", () => {
    expect(bits.add(12, 34)).toBe(BigInt(5) | BigInt(12) | BigInt(34));
    expect(bits.bits).toBe(BigInt(5) | BigInt(12) | BigInt(34));
  });

  it("Can assert whether it has a bit", () => {
    expect(bits.has(1)).toBe(true);
    expect(bits.has(2)).toBe(false);
  });
});
