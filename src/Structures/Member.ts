import type { APIFullOrInteractionGuildMember, Snowflake } from "../Types";
import { RequiresToken } from "../Utils";
import type { ServerLike } from "./Base";
import { Structure } from "./Base";
import type { AbstractGuild } from "./Guild/Abstract";
import type { User } from "./User";

export class Member extends Structure {
  /** The ID of the member. */
  public readonly id: Snowflake;

  /** The guild that the member belongs to. */
  public readonly guild: AbstractGuild;

  /** The user that this member represents. */
  public readonly user: User;

  /** The nickname of this member. */
  public readonly nick?: string;

  /** The avatar hash of this member, if any. */
  public readonly avatar?: string;

  /** The roles of this member. */
  public readonly roles: ReadonlyArray<Snowflake>;

  /** True if the user is pending, i.e. waiting to pass membership screening. */
  public readonly pending: boolean = false;

  /** The time when the user joined the guild. */
  public readonly joinedAt: Date;

  /** The time when the user started boosting the guild. */
  public readonly premiumSince?: Date;

  /** If the user is timed out, the time that the timeout will end. */
  public readonly timedOutUntil?: Date;

  /** Whether the user is server deafened in voice channels. */
  public readonly deaf?: boolean;

  /** Whether the user is server muted in voice channels. */
  public readonly mute?: boolean;

  public constructor(
    server: ServerLike,
    guild: AbstractGuild,
    id: Snowflake,
    user: User,
    data: APIFullOrInteractionGuildMember
  ) {
    super(server);
    this.id = id;
    this.guild = guild;
    this.user = user;
    this.nick = data.nick ?? undefined;
    this.avatar = data.avatar ?? undefined;
    this.pending = data.pending ?? false;

    if ("deaf" in data) this.deaf = data.deaf;
    if ("mute" in data) this.mute = data.mute;

    this.joinedAt = new Date(data.joined_at);

    this.premiumSince = data.premium_since
      ? new Date(data.premium_since)
      : undefined;

    this.timedOutUntil = data.communication_disabled_until
      ? new Date(data.communication_disabled_until)
      : undefined;

    // Get the role IDs from the guild's role object
    this.roles = data.roles as Snowflake[];
  }

  /** Bans the user from the guild. Requires the bot to have ban permission. */
  @RequiresToken
  async kick(data: { reason?: string }) {
    await this.api.delete(`/guilds/${this.guild.id}/members/${this.id}`, {
      headers: data.reason ? { "X-Audit-Log-Reason": data.reason } : undefined,
    });
  }

  /** Bans the user from the guild. Requires the bot to have ban permission. */
  @RequiresToken
  async ban(data: { deleteMessageDays?: number; reason?: string }) {
    await this.api.put(`/guilds/${this.guild.id}/bans/${this.id}`, {
      body: { delete_message_days: data.deleteMessageDays },
      headers: data.reason ? { "X-Audit-Log-Reason": data.reason } : undefined,
    });
  }

  /** Returns the string representation of the member (as a mention). */
  public toString() {
    return `<@${this.id}>`;
  }
}
