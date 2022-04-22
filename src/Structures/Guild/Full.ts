import type { GuildCacheManager } from "../../Cache";
import type { APIGuild, GuildFeature, Snowflake } from "../../Types";
import type { ServerLike } from "../Base";
import { Role } from "../Role";
import { AbstractGuild } from "./Abstract";

export class Guild extends AbstractGuild {
  /** The name of the guild. */
  public readonly name: string;

  /** The description of the guild, if any. */
  public readonly description?: string;

  /** The features of the guild, if any. */
  public readonly features: ReadonlyArray<GuildFeature>;

  /** The roles of the guild. */
  public readonly roles: ReadonlyArray<Role>;

  /** The hash of the guild's icon, if any. */
  public readonly icon?: string;

  /** The hash of the guild's invite splash, if any. */
  public readonly splash?: string;

  /* The hash of the guild's discovery splash, if any. */
  public readonly discoverySplash?: string;

  public constructor(s: ServerLike, d: APIGuild, c?: GuildCacheManager) {
    super(s, d.id as Snowflake, c);
    this.name = d.name;
    this.description = d.description ?? undefined;
    this.features = d.features;
    this.icon = d.icon ?? d.icon_hash ?? undefined;

    // Convert raw roles into role objects, then sort, then store.
    this.roles = (d.roles ?? [])
      .map((r) => new Role(s, this, r))
      .sort((a, b) => a.position - b.position);
  }

  /** Converts an abstract guild into a full guild. */
  public static fromAbstract(guild: AbstractGuild, data: APIGuild) {
    return new this({ api: guild.api, cache: guild.globalCache }, data);
  }
}

const thing = {
  emojis: [
    {
      name: "Status_Dead",
      roles: ["718974223825109123", "718979485231480882", "719020555256201238"],
      id: "936973540866007053",
      require_colons: true,
      managed: false,
      animated: false,
      available: true,
    },
    {
      name: "Status_Offline",
      roles: ["718974223825109123", "718979485231480882", "719020555256201238"],
      id: "936973560730234971",
      require_colons: true,
      managed: false,
      animated: false,
      available: true,
    },
    {
      name: "Status_Degraded",
      roles: ["718974223825109123", "718979485231480882", "719020555256201238"],
      id: "936973596818018324",
      require_colons: true,
      managed: false,
      animated: false,
      available: true,
    },
    {
      name: "Status_Online",
      roles: ["718974223825109123", "718979485231480882", "719020555256201238"],
      id: "936973619253346314",
      require_colons: true,
      managed: false,
      animated: false,
      available: true,
    },
    {
      name: "Button_Decline",
      roles: ["718974223825109123", "718979485231480882", "719020555256201238"],
      id: "936983748547862558",
      require_colons: true,
      managed: false,
      animated: false,
      available: true,
    },
    {
      name: "Button_Accept",
      roles: ["718974223825109123", "718979485231480882", "719020555256201238"],
      id: "936983763672514560",
      require_colons: true,
      managed: false,
      animated: false,
      available: true,
    },
    {
      name: "Account_Create",
      roles: ["718974223825109123", "718979485231480882", "719020555256201238"],
      id: "936994647434227723",
      require_colons: true,
      managed: false,
      animated: false,
      available: true,
    },
    {
      name: "Account_EpicGames",
      roles: ["718974223825109123", "718979485231480882", "719020555256201238"],
      id: "936994707924455454",
      require_colons: true,
      managed: false,
      animated: false,
      available: true,
    },
    {
      name: "Account_Aerial",
      roles: ["718974223825109123", "718979485231480882", "719020555256201238"],
      id: "936995171248267264",
      require_colons: true,
      managed: false,
      animated: false,
      available: true,
    },
    {
      name: "Suggestion_Reject",
      roles: ["718974223825109123", "718979485231480882", "719020555256201238"],
      id: "939537239820632064",
      require_colons: true,
      managed: false,
      animated: false,
      available: true,
    },
    {
      name: "Suggestion_Accept",
      roles: ["718974223825109123", "718979485231480882", "719020555256201238"],
      id: "939537250784542810",
      require_colons: true,
      managed: false,
      animated: false,
      available: true,
    },
  ],
  stickers: [],
  banner: "784618ca1b94a05a0dd1d4e22862379e",
  owner_id: "842379179961745469",
  application_id: null,
  region: "russia",
  afk_channel_id: null,
  afk_timeout: 300,
  system_channel_id: "938069279159492608",
  widget_enabled: true,
  widget_channel_id: "718980074019356713",
  verification_level: 3,
  roles: [],
  default_message_notifications: 1,
  mfa_level: 1,
  explicit_content_filter: 2,
  max_presences: null,
  max_members: 500000,
  max_video_channel_users: 25,
  vanity_url_code: null,
  premium_tier: 2,
  premium_subscription_count: 8,
  system_channel_flags: 13,
  preferred_locale: "en-US",
  rules_channel_id: "718980074019356713",
  public_updates_channel_id: "725786213016928337",
  hub_type: null,
  premium_progress_bar_enabled: true,
  nsfw: false,
  nsfw_level: 0,
};
