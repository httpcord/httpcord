import type { APIWrapper } from "../../API";
import {
  APIChannel,
  APIChannelBase,
  APIInteractionDataResolvedChannel,
  ChannelType
} from "../../Types";
import type { Guild } from "../Guild";
import type { PermissionOverwrite } from "../Permissions";
import { DMChannel, GuildTextChannel } from "./Text";

/** Mixes a channel base type with another type. */
export type MixChannel<T extends ChannelType, X> = (
  | APIChannelBase<T>
  | APIInteractionDataResolvedChannel
) &
  X;

/** Represents a channel that is in a guild. */
export interface GuildChannel {
  /** The guild object that the channel belongs to. */
  guild?: Guild;

  /** The permission overwrites of the channel. */
  permissionOverwrites: ReadonlyArray<PermissionOverwrite>;

  /** The ID of the channel's parent (if it is a thread or in a category) */
  parentId?: string;
}

/**
 * Creates a channel object from a guild object and channel type.
 *
 * @param guild The guild that will be associated with the channel.
 * @param channel The channel data that will be used to create the channel.
 * @returns The channel object.
 * @internal
 */
export function createChannelObject(
  api: APIWrapper,
  channel: MixChannel<ChannelType, APIChannel>,
  guild?: Guild
) {
  if (![ChannelType.DM, ChannelType.GroupDM].includes(channel.type) && !guild)
    throw new Error("Channel wasn't a DM channel and no guild was passed");

  switch (channel.type) {
    case ChannelType.GuildText:
      return new GuildTextChannel(api, guild!, channel);

    case ChannelType.DM:
      return new DMChannel(api, channel);
  }
}
