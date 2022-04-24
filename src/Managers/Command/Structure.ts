import type { ApplicationCommandConfig, Localizations } from "./Types";

/** Represents a generic application command. */
export abstract class ApplicationCommand {
  /** The English (en-US) name of the application command. */
  public readonly name: string;
  /** The localization data of the name of the application command. */
  public readonly nameLocalizations: Localizations;

  /** The English (en-US) description of the application command. */
  public readonly description?: string;
  /** The localization data of the description of the application command. */
  public readonly descriptionLocalizations?: Localizations;

  public constructor(config: ApplicationCommandConfig) {
    this.name =
      typeof config.name === "object" ? config.name["en-US"] : config.name;
    this.nameLocalizations =
      typeof config.name === "object" ? config.name : { "en-US": config.name };

    if (config.description) {
      this.description =
        typeof config.description === "object"
          ? config.description["en-US"]
          : config.description;

      this.descriptionLocalizations =
        typeof config.description === "object"
          ? config.description
          : { "en-US": config.description };
    }
  }
}
