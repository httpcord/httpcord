/** Represents a cached, time-stamped value from a cache manager. */
export class CachedValue<V> {
  /** The time the value was created. */
  public readonly created: number;

  /** The last read time of the value. */
  public lastRead?: number;

  /** The last write time of the value. */
  public lastWrite: number;

  /** The value itself. */
  #value: V;

  public constructor(value: V) {
    this.#value = value;
    this.lastWrite = this.created = Date.now();
  }

  /** Gets the cached value without updating the access time. */
  public get value() {
    return this.#value;
  }

  /** Gets the cached value and updates the access time. */
  public read() {
    this.lastRead = Date.now();
    return this.#value;
  }

  /** Writes to the value. */
  public write(value: V) {
    this.lastWrite = Date.now();
    this.#value = value;
    return this;
  }
}
