import type { APIDMChannel, APIUser, Snowflake } from "../Types";
import { Routes, UserFlags } from "../Types";
import { Bits, RequiresToken } from "../Utils";
import type { ServerLike } from "./Base";
import { Structure } from "./Base";
import { DMChannel } from "./Channels";

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
  public channel?: DMChannel;

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
    if (!this.channel) this.channel = await this.fetchChannel();
  }

  /** Fetches the DM channel. */
  @RequiresToken
  private async fetchChannel() {
    const data = (await this.api.post(Routes.userChannels(), {
      body: { recipient_id: this.id },
    })) as APIDMChannel;
    return new DMChannel({ api: this.api, cache: this.globalCache }, data);
  }

  /** Returns the string representation of the user (as a mention). */
  public toString() {
    return `<@${this.id}>`;
  }
}
// Utility
export { UserFlags as Flags, UserFlags };
