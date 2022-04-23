import type { APIEmoji, Snowflake } from "../Types";
import type { ServerLike } from "./Base";
import { Structure } from "./Base";
import type { AbstractGuild } from "./Guild/Abstract";

/** Represents a custom emoji from Discord. */
export class Emoji extends Structure {
  /** The guild that the emoji belongs to. */
  public readonly guild?: AbstractGuild;

  /** The ID of the emoji. */
  public readonly id?: Snowflake;

  /** The name of the emoji. */
  public readonly name?: string;

  /** True if the emoji is animated. */
  public readonly animated: boolean;

  constructor(server: ServerLike, data: APIEmoji, guild?: AbstractGuild) {
    super(server);
    this.guild = guild;
    this.id = data.id as Snowflake;
    this.name = data.name ?? undefined;
    this.animated = data.animated ?? false;
  }
}
