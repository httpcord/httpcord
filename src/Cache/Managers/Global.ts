import type { AbstractGuild } from "../../Structures";
import { Guild, User } from "../../Structures";
import type { ServerLike } from "../../Structures/Base";
import type { APIGuild, APIUser, Snowflake } from "../../Types";
import { Routes } from "../../Types";
import { RequiresToken, sweepAfterMinutes } from "../../Utils";
import { Cache } from "../Cache";

/**
 * Represents the root cache manager. Most structures will be cached to improve
 * performance and not have to re-fetch it every time.
 */
export class GlobalCacheManager {
  /** Represents the global user cache. */
  public readonly users = new Cache<User>({
    fetch: this.fetchUser.bind(this),
    sweeper: sweepAfterMinutes(5, 5), // if >= 5 min since last read/write
    sweepInterval: 15 * 60 * 1000, // 15 minutes
    maxSize: 200,
  });

  /** Represents the global guild cache. */
  public readonly guilds = new Cache<AbstractGuild>({
    fetch: this.fetchGuild.bind(this),
    sweeper: sweepAfterMinutes(30, 30), // if >= 30 min since last read/write
    sweepInterval: 30 * 60 * 1000, // 30 minutes
    maxSize: 50,
  });

  public constructor(public readonly server: ServerLike) {}

  /** Fetches a user from the Discord API. */
  @RequiresToken
  private async fetchUser(id: Snowflake) {
    const data = (await this.server.api.get(Routes.user(id))) as APIUser;
    return new User(this.server, data);
  }

  /** Fetches a guild from the Discord API. */
  @RequiresToken
  private async fetchGuild(id: Snowflake) {
    const data = (await this.server.api.get(Routes.user(id))) as APIGuild;
    return new Guild(this.server, data);
  }
}
