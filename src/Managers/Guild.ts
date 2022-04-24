import type { Snowflake } from "../Types";
import { CommandManager } from "./Command";

/**
 * Represents managers that are associated with a guild, without actually having
 * any knowledge of the guild itself. Right now, this is mostly used for
 * registering application commands to a guild without having to fetch it.
 */
export class GuildManagerProxy {
  /** The application command manager of the guild. */
  public readonly command = new CommandManager();

  // Shorthands
  public readonly slash = this.command.slash;

  constructor(readonly id: Snowflake) {}
}
