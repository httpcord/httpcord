import type { APIWrapper } from "../API";
import type { Channel, Guild, Message, Role, User } from "../Structures";
import { CacheManager } from "./Manager";

/**
 * Represents the root cache manager. Most structures will be cached to improve
 * performance and not have to re-fetch it every time.
 */
export class GlobalCacheManager {
  public users: CacheManager<User>;
  public channels: CacheManager<Channel>;
  public guilds: CacheManager<Guild>;
  public messages: CacheManager<Message>;
  public roles: CacheManager<Role>;

  public constructor(readonly api: APIWrapper) {
    this.users = new CacheManager<User>();
    this.channels = new CacheManager<Channel>();
    this.guilds = new CacheManager<Guild>();
    this.messages = new CacheManager<Message>();
    this.roles = new CacheManager<Role>();
  }
}

export * from "./Manager";
