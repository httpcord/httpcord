import { ChannelType } from "../../Types";
import type { ServerLike } from "../Base";
import { Structure } from "../Base";
import type {
  DMChannel,
  GroupDMChannel,
  GuildNewsChannel,
  GuildTextChannel
} from "./Text";
import type { MixChannel } from "./Utils";
import type { GuildVoiceChannel } from "./Voice";

/** Represents data that any channel has. */
type ChannelData<T extends ChannelType> = MixChannel<T, { [key: string]: any }>;

/** Represents a generic channel that is extended by other channels. */
export class Channel<T extends ChannelType = ChannelType> extends Structure {
  /** The unique ID of the channel. */
  public readonly id: string;
  /** The numerical type of the channel. */
  public readonly type: ChannelType;
  /** The name of the channel. */
  public readonly name?: string;

  public constructor(server: ServerLike, data: ChannelData<T>) {
    super(server);

    this.id = data.id;
    this.type = data.type;
    this.name = data.name;
  }

  /** True if this is a GuildTextChannel. */
  public isGuildTextChannel(): this is GuildTextChannel {
    return this.type === ChannelType.GuildText;
  }

  /** True if this is a DMChannel. */
  public isDMChannel(): this is DMChannel {
    return this.type === ChannelType.DM;
  }

  /** True if this is a GuildVoiceChannel. */
  public isGuildVoiceChannel(): this is GuildVoiceChannel {
    return this.type === ChannelType.GuildVoice;
  }

  /** True if this is a GroupDMChannel. */
  public isGroupDMChannel(): this is GroupDMChannel {
    return this.type === ChannelType.GroupDM;
  }

  /** True if this is a GuildNewsChannel. */
  public isGuildNewsChannel(): this is GuildNewsChannel {
    return this.type === ChannelType.GuildNews;
  }

  /** Returns the string representation of the channel (it as a mention). */
  public toString() {
    return `<#${this.id}>`;
  }
}
