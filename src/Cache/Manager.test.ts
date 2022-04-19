import { sleep } from "../Utils";
import { CacheManager } from "./Manager";

describe("CacheManager", () => {
  let manager: CacheManager<string>;

  beforeEach(
    () =>
      (manager = new CacheManager({
        fetch: jest.fn((id: string) => id),
      }))
  );

  it("Instantiates correctly", () => {
    expect(manager).toBeDefined();
  });

  it("Can store values", () => {
    expect(manager.get("123456")).toBeUndefined();
    expect(manager.size).toBe(0);
    manager.put("123456", "some value");
    expect(manager.get("123456")).toBe("some value");
    expect(manager.size).toBe(1);
  });

  it("Can update values", () => {
    expect(manager.get("123456")).toBeUndefined();
    expect(manager.size).toBe(0);
    manager.put("123456", "some value");
    expect(manager.get("123456")).toBe("some value");
    expect(manager.size).toBe(1);
    manager.put("123456", "new value");
    expect(manager.get("123456")).toBe("new value");
    expect(manager.size).toBe(1);
  });

  it("Can clear the cache", () => {
    expect(manager.get("123456")).toBeUndefined();
    expect(manager.size).toBe(0);
    manager.put("123456", "some value");
    expect(manager.get("123456")).toBe("some value");
    expect(manager.size).toBe(1);
    manager.clear();
    expect(manager.get("123456")).toBeUndefined();
    expect(manager.size).toBe(0);
  });

  it("Can fetch and cache values", async () => {
    expect(manager.size).toBe(0);
    expect(await manager.fetch("testing")).toBe("testing");
    expect(manager["fetcher"]).toBeCalledTimes(1);
    expect(manager.size).toBe(1);
    expect(manager.get("testing")).toBe("testing");
    expect(manager["fetcher"]).toBeCalledTimes(1);
    expect(manager.size).toBe(1);
  });

  it("Can't fetch if there's no fetcher", async () => {
    const noFetchManager = new CacheManager<string>();
    expect(await noFetchManager.fetch("testing")).toBeUndefined();
  });

  it("Does not fetch values already present in cache", async () => {
    manager.put("123456", "some value");
    expect(await manager.fetch("123456")).toBe("some value");
    expect(manager["fetcher"]).toBeCalledTimes(0);
  });

  it("Does not overwrite values if told not to", () => {
    expect(manager.get("123456")).toBeUndefined();
    manager.putIfNotExists("123456", "some value");
    expect(manager.get("123456")).toBe("some value");
    manager.putIfNotExists("123456", "some other value");
    expect(manager.get("123456")).toBe("some value");
  });

  it("Does not sweep when there is no sweeper", async () => {
    const sweepingManager = new CacheManager<string>({ sweepInterval: 100 });

    sweepingManager.put("123", "some value");
    sweepingManager.startSweeping();
    await sleep(200);
    expect(sweepingManager.get("123")).toBe("some value");
  });

  it("Can sweep manually", () => {
    const sweeper = jest.fn((_, key: string) => key === "123");
    const sweepingManager = new CacheManager<string>({
      sweeper,
      sweepInterval: 0,
    });

    sweepingManager.put("123", "some value");
    sweepingManager.put("456", "some other value");
    expect(sweepingManager.size).toBe(2);

    sweepingManager.sweep();
    expect(sweeper).toBeCalledTimes(2);
    expect(sweepingManager.size).toBe(1);
    expect(sweepingManager.get("123")).toBeUndefined();
    expect(sweepingManager.get("456")).toBe("some other value");
  });

  it("Can sweep automatically", async () => {
    const sweeper = jest.fn((_, key: string) => key === "123");
    const sweepingManager = new CacheManager<string>({
      sweeper,
      sweepInterval: 500,
    });

    // First set the values
    sweepingManager.put("123", "some value");
    sweepingManager.put("456", "some other value");
    expect(sweepingManager.size).toBe(2);
    expect(sweeper).toBeCalledTimes(0);

    // Wait and check if they were swept
    await sleep(600);
    expect(sweeper).toBeCalledTimes(2);
    expect(sweepingManager.size).toBe(1);
    expect(sweepingManager.get("123")).toBeUndefined();
    expect(sweepingManager.get("456")).toBe("some other value");

    // Now stop sweeping, reset the value that was swept
    sweepingManager.stopSweeping();
    sweepingManager.put("123", "some value");
    expect(sweepingManager.size).toBe(2);
    await sleep(600);

    // Check if it actually stopped sweeping or if it kept going
    expect(sweeper).toBeCalledTimes(2);
    expect(sweepingManager.size).toBe(2);
    expect(sweepingManager.get("123")).toBe("some value");
    expect(sweepingManager.get("456")).toBe("some other value");

    // Now start sweeping again!
    sweepingManager.startSweeping();
    await sleep(600);

    expect(sweeper).toBeCalledTimes(4);
    expect(sweepingManager.size).toBe(1);
    expect(sweepingManager.get("123")).toBeUndefined();
    expect(sweepingManager.get("456")).toBe("some other value");

    sweepingManager.stopSweeping();
  });
});
