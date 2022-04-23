import type {
  APIGuildCategoryChannel,
  ChannelType,
  Snowflake
} from "../../Types";
import type { ServerLike } from "../Base";
import type { Guild } from "../Guild";
import type { PermissionOverwrite } from "../Permissions";
import { Permissions } from "../Permissions";
import { Channel } from "./Base";
import type { GuildChannel, MixChannel } from "./Utils";

/** Represents a category channel. */
export class CategoryChannel
  extends Channel<ChannelType.GuildCategory>
  implements GuildChannel
{
  public readonly guild: Guild;
  public readonly permissionOverwrites: ReadonlyArray<PermissionOverwrite>;

  public constructor(
    server: ServerLike,
    data: MixChannel<ChannelType.GuildCategory, APIGuildCategoryChannel>,
    guild: Guild
  ) {
    super(server, data);

    this.guild = guild;
    this.permissionOverwrites =
      data.permission_overwrites?.map((v) => ({
        id: v.id as Snowflake,
        type: v.type,
        allow: new Permissions(v.allow),
        deny: new Permissions(v.deny),
      })) ?? [];
  }
}
