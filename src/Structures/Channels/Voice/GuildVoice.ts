import type { APIWrapper } from "../../../API";
import type {
  APIChannelBase,
  APIVoiceChannel,
  ChannelType
} from "../../../Types";
import type { Guild } from "../../Guild";
import type { VoiceChannelType } from "./Base";
import { VoiceBasedChannel } from "./Base";

/** Represents a voice based channel. */
export class GuildVoiceChannel<
  T extends VoiceChannelType = ChannelType.GuildVoice
> extends VoiceBasedChannel<T> {
  constructor(
    api: APIWrapper,
    guild: Guild,
    data: APIChannelBase<T> & APIVoiceChannel
  ) {
    super(api, guild, data);
  }
}
