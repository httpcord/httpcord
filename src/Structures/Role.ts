import type { APIRole, Snowflake } from "../Types";
import type { ServerLike } from "./Base";
import { Structure } from "./Base";
import type { AbstractGuild } from "./Guild/Abstract";
import { Permissions } from "./Permissions";

// This object does not have a "Abstract" counterpart because roles are always
// received full. See "Resolved Data Structure" under "Receiving and Responding"
// in the https://discord.dev/docs for more info.

interface RoleTags {
  /** True if this is the guild's premium subscriber role. */
  isPremiumSubscriberRole: boolean;

  /** The ID of the integration that manages this role, if any. */
  integrationId?: Snowflake;

  /** The ID of the bot that manages this role, if any. */
  botId?: Snowflake;
}

/** Represents a role received from Discord API. */
export class Role extends Structure {
  /** The guild that the role belongs to. */
  public readonly guild: AbstractGuild;
  /** The unique ID of this role (same as Guild ID if it's @everyone) */
  public readonly id: Snowflake;
  /** The name of the role. */
  public readonly name: string;
  /** The number representation of the hex color code of this role. */
  public readonly color: number;
  /** True if the guild is hoisted (displayed above others in member list). */
  public readonly hoisted: boolean;
  /** The position of the guild. */
  public readonly position: number;
  /** The permissions of this role. */
  public readonly permissions: Permissions;
  /** Whether or not this role is managed by an integration. */
  public readonly managed: boolean;
  /** Whether or not this role is mentionable. */
  public readonly mentionable: boolean;
  /** The hash of the role's icon, if any. */
  public readonly icon?: string;
  /** The emoji associated with the role, if any. */
  public readonly emoji?: string;
  /** The tags of the role, if any. */
  public readonly tags?: RoleTags;

  public constructor(server: ServerLike, guild: AbstractGuild, data: APIRole) {
    super(server);

    this.guild = guild;
    this.id = data.id as Snowflake;
    this.name = data.name;
    this.color = data.color;
    this.hoisted = data.hoist;
    this.position = data.position;
    this.permissions = new Permissions(data.permissions);
    this.managed = data.managed;
    this.mentionable = data.mentionable;

    this.icon = data.icon || undefined;
    this.emoji = data.unicode_emoji || undefined;
    this.tags = {
      isPremiumSubscriberRole: data.tags?.premium_subscriber === null,
      integrationId: data.tags?.integration_id as Snowflake,
      botId: data.tags?.bot_id as Snowflake,
    };
  }

  /** Returns the string representation of the role (the role as a mention). */
  public toString() {
    return `<@&${this.id}>`;
  }
}
