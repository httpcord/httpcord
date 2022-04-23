import type { APIWrapper } from "../../../API";
import type {
  APIChannelBase,
  APIVoiceChannel,
  ChannelType
} from "../../../Types";
import type { Guild } from "../../Guild";
import { GuildVoiceChannel } from "./GuildVoice";

/** Represents a voice based channel. */
export class GuildStageVoiceChannel extends GuildVoiceChannel<ChannelType.GuildStageVoice> {
  constructor(
    api: APIWrapper,
    guild: Guild,
    data: APIChannelBase<ChannelType.GuildStageVoice> & APIVoiceChannel
  ) {
    super(api, guild, data);
  }
}
