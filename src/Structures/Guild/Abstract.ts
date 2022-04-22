import { GuildCacheManager } from "../../Cache";
import type { Snowflake } from "../../Types";
import type { ServerLike } from "../Base";
import { Structure } from "../Base";

/** Represents a guild that has not been fully fetched from the API. */
export class AbstractGuild extends Structure {
  /** The ID of the guild. */
  public readonly id: Snowflake;

  /** The cache of the guild. */
  public readonly cache: GuildCacheManager;

  public constructor(s: ServerLike, id: Snowflake, cache?: GuildCacheManager) {
    super(s);
    this.cache = cache ?? new GuildCacheManager(s, this);
    this.id = id;
  }
}
