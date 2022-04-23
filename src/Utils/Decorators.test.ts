import { RequiresToken } from "./Decorators";

describe("RequiresToken", () => {
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
