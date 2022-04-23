import type { APIGuildTextChannel, ChannelType } from "../../../Types";
import type { ServerLike } from "../../Base";
import type { Guild } from "../../Guild";
import type { GuildChannel, MixChannel } from "../Utils";
import { TextBasedChannel } from "./Base";

/** Represents the possible types of a text channel. */
export type GuildTextChannelType =
  | ChannelType.GuildText
  | ChannelType.GuildNews;

/** Represents a guild text channel. */
export class GuildTextChannel<
    T extends GuildTextChannelType = ChannelType.GuildText
  >
  extends TextBasedChannel<T>
  implements GuildChannel
{
  public readonly guild?: Guild;

  /** The topic of the channel. */
  public readonly topic?: string;

  /** True if the channel has been marked as NSFW (no 18+ content filter) */
  public readonly nsfw: boolean;

  constructor(
    api: ServerLike,
    data: MixChannel<T, APIGuildTextChannel<T>>,
    guild?: Guild
  ) {
    super(api, data);

    this.guild = guild;
    this.topic = data.topic ?? undefined;
    this.nsfw = data.nsfw ?? false;
  }
}
