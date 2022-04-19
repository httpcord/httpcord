import type { MaybePromise, Snowflake } from "../Types";

export interface CacheManagerConfig<V> {
  /** A function that can fetch a structure for a cache manager. */
  fetch?: (id: Snowflake) => MaybePromise<V>;

  /**
   * A function that periodically runs to sweep the cache. If it returns true,
   * the structure in cache will be deleted.
   */
  sweeper?: (cache: CacheManager<V>, id: Snowflake, data: V) => boolean;

  /**
   * The interval on which the sweep function will run. Set to 0 to disable.
   * @default 3600000 (1 hour).
   */
  sweepInterval?: number;
}

/**
 * Represents a cache manager for any data structure.
 *
 * It is very flexible and generic, however you must provide your own function
 * to fetch the data from the web or some other source if it is not present.
 */
export class CacheManager<V> {
  private map = new Map<Snowflake, V>();

  // Sweeping things
  private swDelay: number;
  private swInt?: number | NodeJS.Timer;

  private fetcher?: (id: Snowflake) => MaybePromise<V>;
  private sweeper?: (cache: CacheManager<V>, id: Snowflake, data: V) => boolean;

  public constructor(config?: CacheManagerConfig<V>) {
    this.fetcher = config?.fetch;
    this.sweeper = config?.sweeper;
    this.swDelay = config?.sweepInterval ?? 3600000;

    // Set up sweeper
    if (this.sweeper) this.startSweeping();
  }

  /** The current number of items in the cache. */
  get size() {
    return this.map.size;
  }

  /** Runs the sweep function manually. */
  public sweep() {
    // Clear the sweep interval if we are sweeping and there is no sweeper func.
    // @ts-expect-error: Stupid NodeJS custom timer object
    if (!this.sweeper && this.swInt) return clearInterval(this.swInt);

    this.map.forEach((v, k) => {
      const shouldDelete = this.sweeper!(this, k, v);
      if (shouldDelete) this.map.delete(k);
    });
  }

  /** Empties the cache. */
  public clear() {
    this.map.clear();
  }

  /** Stops the automatic sweeping. */
  public stopSweeping() {
    // @ts-expect-error: Stupid NodeJS custom timer object
    if (this.swInt) this.swInt = clearInterval(this.swInt);
  }

  /** Starts the automatic sweeping. */
  public startSweeping() {
    if (this.swDelay === 0 || this.swInt) return;
    this.swInt = setInterval(this.sweep.bind(this), this.swDelay);
  }

  /**
   * Gets the structure stored in the cache manager by ID.
   *
   * @param id The ID of the structure to get.
   * @returns The structure found, undefined otherwise.
   */
  public get(id: Snowflake) {
    return this.map.get(id);
  }

  /**
   * Puts a value into the cache. This shouldn't be used yourself, it is called
   * automatically, for example, by the fetch method, or by the cache consumers.
   *
   * @param id The ID of the structure.
   * @param data The structure to put.
   * @returns The cache manager.
   */
  public put(id: Snowflake, data: V) {
    this.map.set(id, data);
    return this;
  }

  /**
   * Puts a value into the cache, but only if it does not already exist. This is
   * used by, for example, interaction handlers, to ensure objects like guilds
   * are only received once (as guilds have an embedded member cache).
   *
   * @param id The ID of the structure.
   * @param data The structure to put.
   * @returns The object that in the end is stored in the cache.
   */
  public putIfNotExists(id: Snowflake, data: V) {
    const cached = this.map.get(id);
    if (cached) return cached;

    this.map.set(id, data);
    return data;
  }

  /**
   * Gets the structure stored in the cache manager by ID. If it is not cached,
   * it will be fetched and saved to the cache for future use.
   *
   * @param id The ID of the structure to get/fetch.
   * @returns The structure that was either fetched or retrieved from the cache.
   */
  public async fetch(id: Snowflake) {
    const cached = this.map.get(id);
    if (cached || !this.fetcher) return cached;

    const data = await this.fetcher(id);
    this.put(id, data);
    return data;
  }
}
