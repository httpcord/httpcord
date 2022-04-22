import type { ServerLike } from "../../Structures/Base";
import type { AbstractGuild } from "../../Structures/Guild/Abstract";
import { Member } from "../../Structures/Guild/Member/Full";
import { User } from "../../Structures/User";
import type { APIFetchedGuildMember, Snowflake } from "../../Types";
import { Routes } from "../../Types";
import { RequiresToken, sweepAfterMinutes } from "../../Utils";
import { Cache } from "../Cache";

/**
 * Represents the cache manager of a guild. It only contains caches that are
 * specific to that guild.
 */
export class GuildCacheManager {
  private readonly server: ServerLike;
  private readonly guild: AbstractGuild;

  /** Represents the guild's member cache. */
  public readonly members: Cache<Member>;

  public constructor(server: ServerLike, guild: AbstractGuild) {
    this.server = server;
    this.guild = guild;
    this.members = new Cache({
      fetch: this.fetchMember.bind(this),
      sweeper: sweepAfterMinutes(5, 5), // same as user in global
      sweepInterval: 15 * 60 * 1000, // 15 minutes
      maxSize: 50,
    });
  }

  @RequiresToken
  private async fetchMember(id: Snowflake) {
    const route = Routes.guildMember(this.guild.id, id);
    const data = (await this.server.api.get(route)) as APIFetchedGuildMember;
    const user = new User(this.server, data.user);
    return new Member(this.server, this.guild, id, user, data);
  }
}
