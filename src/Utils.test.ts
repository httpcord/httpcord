import { Bits, RequiresToken, sleep } from "./Utils";

const marginOfError = 10;

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
});

describe("Utils/Sleep", () => {
  it("Sleeps for a second", async () => {
    const time = Date.now();
    await sleep(1000);
    const time2 = Date.now();

    expect(time2 - time).toBeGreaterThanOrEqual(1000);
    expect(time2 - time).toBeLessThan(1000 + marginOfError);
  });
});

describe("Utils/Decorators/RequiresToken", () => {
  const testObject = { call: jest.fn(), api: { hasToken: false } };
  const testDescriptor = Object.getOwnPropertyDescriptor(testObject, "call")!;

  it("Throws when a token does not exist", () => {
    const newDescriptor = RequiresToken(testObject, "call", testDescriptor);
    expect(newDescriptor.value!).toThrow("call requires a bot token.");
    expect(testObject.call.mock.calls).toHaveLength(0);
  });

  it("Does not throw when a token exists", () => {
    testObject.api.hasToken = true;
    const newDescriptor = RequiresToken(testObject, "call", testDescriptor);
    newDescriptor.value!(); // Invoke the mock function
    expect(testObject.call).toBeCalled();
  });
});
