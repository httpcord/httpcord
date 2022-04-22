import type { APIWrapper } from "../API";
import type { GlobalCacheManager } from "../Cache";

/**
 * Represents an object that has the core properties of a server. Other than the
 * required properties, it can have any other property it wants.
 */
export interface ServerLike {
  readonly api: APIWrapper;
  readonly cache: GlobalCacheManager;
}

/**
 * Represents a base abstract structure that all other structures extend.
 * Does not do anything on its' own.
 */
export abstract class Structure {
  /** Represents the associated API wrapper of the structure. */
  public api: APIWrapper;
  /** Represents the associated global cache manager of the structure. */
  public globalCache: GlobalCacheManager;

  public constructor(serverLike: ServerLike) {
    this.api = serverLike.api;
    this.globalCache = serverLike.cache;
  }

  /**
   * Delegates this specific structure to a different server.
   * This is useful when, for example, sending a message as a different bot user
   * than the one the structure was instantiated with.
   *
   * @param serverLike The server to associate with the structure.
   * @returns The structure, delegated.
   */
  public delegate(serverLike: ServerLike) {
    this.api = serverLike.api;
    this.globalCache = serverLike.cache;
  }
}
