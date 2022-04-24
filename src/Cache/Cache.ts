import type { Maybe, MaybePromise, Snowflake } from "../Types";
import { CachedValue } from "./Value";

/** Represents a cache fetcher function. */
export type Fetcher<T> = (id: Snowflake) => MaybePromise<Maybe<T>>;

/** Represents a cache sweeper function. */
export type Sweeper<T> = (
  cache: Cache<T>,
  id: Snowflake,
  data: CachedValue<T>
) => boolean;

/** Represents the configuration for a cache. */
export interface CacheConfig<T> {
  /** A function that can fetch a structure for a cache. */
  fetch?: Fetcher<T>;

  /**
   * A function that runs when an item is considered to be deleted internally.
   * This includes automatic/manual sweeping and when deciding what should be
   * deleted when trying to put an item and the cache is full.
   */
  sweeper?: Sweeper<T>;

  /**
   * The interval on which the sweep function will run. Set to 0 to disable.
   * @default 3600000 (1 hour).
   */
  sweepInterval?: number;

  /** The maximum number of items in the cache. */
  maxSize?: number;
}

/**
 * Represents a cache for any data structure.
 *
 * It is very flexible and generic, however you must provide your own function
 * to fetch the data from the web or some other source if it is not present.
 */
export class Cache<T> {
  private map = new Map<Snowflake, CachedValue<T>>();

  /** The maximum number of items in the cache. */
  public readonly maxSize?: number;

  // Sweeping things
  private swDelay: number;
  private swInt?: number | NodeJS.Timer;

  private fetcher?: Fetcher<T>;
  private sweeper?: Sweeper<T>;

  public constructor(config?: CacheConfig<T>) {
    this.maxSize = config?.maxSize;
    this.fetcher = config?.fetch;
    this.sweeper = config?.sweeper;
    this.swDelay = config?.sweepInterval ?? 3600000;

    // Set up sweeper
    if (this.sweeper) this.startSweeping();
  }

  /** The current number of items in the cache. */
  public get size() {
    return this.map.size;
  }

  /** Runs the sweep function manually. */
  public sweep() {
    // Clear the sweep interval if we are sweeping and there is no sweeper func.
    // @ts-expect-error: Stupid NodeJS custom timer object
    if (!this.sweeper && this.swInt) return clearInterval(this.swInt);
    if (!this.sweeper) return;

    this.map.forEach((v, k) => {
      if (!this.sweeper) return; // To make typescript happy
      const shouldDelete = this.sweeper(this, k, v);
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
   * Gets the structure stored in the cache by ID.
   *
   * @param id The ID of the structure to get.
   * @returns The structure found, undefined otherwise.
   */
  public get(id: Snowflake) {
    return this.map.get(id)?.read();
  }

  /**
   * Puts a value into the cache. This shouldn't be used yourself, it is called
   * automatically, for example, by the fetch method, or by the cache consumers.
   *
   * @param id The ID of the structure.
   * @param data The structure to put.
   * @returns The cache.
   */
  public put(id: Snowflake, data: T) {
    if (this.maxSize && this.size >= this.maxSize && !this.map.get(id)) {
      for (const [k, v] of this.map.entries()) {
        // If there is a sweeper, check with it to make sure it's OK to delete.
        const shouldDelete = this.sweeper ? this.sweeper(this, k, v) : true;
        if (shouldDelete) {
          this.map.delete(k);
          this.map.set(id, new CachedValue(data));
          break;
        }
      }
    } else {
      this.map.set(id, this.map.get(id)?.write(data) ?? new CachedValue(data));
    }
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
  public putIfNotExists(id: Snowflake, data: T) {
    const cached = this.map.get(id);
    if (cached) return cached.read();

    this.put(id, data);
    return data;
  }

  /**
   * Creates a new structure and puts it in the cache.
   * @param id The ID of the structure.
   * @param cb A function that creates the structure in the cache
   * @returns The structure that was either cached or created
   */
  public createIfNotExists(id: Snowflake, cb: () => T) {
    const cached = this.get(id);
    if (cached) return cached;
    return this.putIfNotExists(id, cb());
  }

  /**
   * Gets the structure stored in the cache by ID. If it is not cached, it will
   * be fetched and saved to the cache for future use.
   *
   * @param id The ID of the structure to get/fetch.
   * @returns The structure that was either fetched or retrieved from the cache.
   */
  public async fetch(id: Snowflake) {
    const cached = this.map.get(id);
    if (cached || !this.fetcher) return cached?.read();

    const data = await this.fetcher(id);
    if (data) this.put(id, data);
    return data;
  }
}
