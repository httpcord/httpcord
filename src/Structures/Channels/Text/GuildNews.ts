import type { ChannelType } from "../../../Types";
import { GuildTextChannel } from "./GuildText";

/** Represents a guild news channel. */
export class GuildNewsChannel extends GuildTextChannel<ChannelType.GuildNews> {}
