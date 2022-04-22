import type { APIUser, Snowflake } from "../Types";
import { UserFlags } from "../Types";
import { Bits, RequiresToken } from "../Utils";
import type { ServerLike } from "./Base";
import { Structure } from "./Base";

/** Represents possible flags that a user can have. */
export class UserFlagBits extends Bits {
  public static Flags = UserFlags;
}

/** Represents a user on Discord. */
export class User extends Structure {
  /** The user's unique ID (snowflake). */
  public readonly id: Snowflake;
  /** The user's username. Not unique. */
  public readonly username: string;
  /** The user's discriminator. Not unique. */
  public readonly discriminator: string;
  /** The user's avatar hash. */
  public readonly avatar?: string;

  /** Whether the user is a "system" user or not. */
  public readonly system: boolean = false;
  /** Whether the user is a "bot" user or not. */
  public readonly bot: boolean = false;
  /** The user's public flags. */
  public readonly publicFlags: UserFlagBits;

  /** Represents the DM channel with the user. */
  private dmChannel?: null;

  public constructor(server: ServerLike, data: APIUser) {
    super(server);

    this.id = data.id as Snowflake;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.avatar = data.avatar ?? undefined;
    this.system = data.system ?? false;
    this.bot = data.bot ?? false;
    this.publicFlags = new UserFlagBits(data.public_flags ?? 0);
  }

  /**
   * Sends a message to the user.
   * @param msg The message to send. Can either be a string or message object.
   */
  @RequiresToken
  public async send(msg: string) {
    await this.api.post(`/users/@me/channels`);
  }
}
// Utility
export { UserFlags as Flags, UserFlags };
