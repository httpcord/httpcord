import type {
  ApplicationCommandPermissionType,
  LocaleString,
} from "../../Types";

/** The localization object (a map of locale names to their native strings). */
export type Localizations = Partial<Record<LocaleString, string>> & {
  // english localization is required and used as fallback internally
  "en-US": string;
};

/** The type for either a base (English) string or a localization object. */
export type StringOrLocalized = string | Localizations;

/** The permission of an application command. */
export type ApplicationCommandPermission = {
  /** The type of the permission. 1 for a role, 2 for a user. */
  type: ApplicationCommandPermissionType;
};

/** The configuration object used when creating an application command. */
export type ApplicationCommandConfig<T = {}> = {
  /** The name of the application command. Must be lowercase. */
  name: StringOrLocalized;

  /** The description of the application command. */
  description?: StringOrLocalized;
} & T;

/** The configuration object used when creating a guild application command. */
export type GuildApplicationCommandConfig<T = {}> = ApplicationCommandConfig & {
  /** The per-guild permissions of this application command. */
  permissions?: ApplicationCommandPermission[];
} & T;
