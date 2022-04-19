import type { Application, Router } from "express";

/** Base configuration for any interaction server. */
export interface BaseServerConfig {
  /** The public key of the server. Get it from the Discord Developer Portal. */
  publicKey: string;

  /** The token of the bot, if any. Get it in the Bot tab of the Dev Portal. */
  token?: string;

  /**
   * The delay (in ms) after which slash commands will be registered. Set to
   * false to not register slash commands automatically (you can still register
   * then yourself with BaseServer#registerCommands).
   * @default 10000
   */
  registerCommands?: false | number;
}

/** The configuration for an express server. */
export type ExpressServerConfig =
  | { app: Application; url?: string }
  | { router: Router };
