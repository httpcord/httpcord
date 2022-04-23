import type { APIWrapper } from "../../../API";
import type {
  APIChannelBase,
  APIVoiceChannel,
  ChannelType
} from "../../../Types";
import type { Guild } from "../../Guild";
import { Channel } from "../Base";

/** Represents a type of a voice channel. */
export type VoiceChannelType =
  | ChannelType.GuildVoice
  | ChannelType.GuildStageVoice;

/** Represents a voice based channel. */
export class VoiceBasedChannel<T extends VoiceChannelType> extends Channel<T> {
  constructor(
    api: APIWrapper,
    guild: Guild,
    data: APIChannelBase<T> & APIVoiceChannel
  ) {
    super(api, guild, data);
  }
}
