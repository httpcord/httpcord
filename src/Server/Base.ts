import { APIWrapper } from "../API";
import { GlobalCacheManager } from "../Cache";
import { CommandManager, ComponentManager } from "../Managers";
import {
  ApplicationCommandInteraction,
  AutocompleteInteraction,
  Interaction,
  MessageComponentInteraction
} from "../Structures";
import type {
  APIApplication as App,
  APIInteraction as RawInteraction,
  APIInteractionResponse as RawResponse
} from "../Types";
import type { BaseServerConfig } from "./Types";

/** Base interaction server that other server types all extend. */
export class BaseServer<T = BaseServerConfig> {
  /** The API manager of the server that interfaces with the Discord HTTP API */
  public readonly api: APIWrapper;
  /** The server's global cache, that keeps all data it receives. */
  public readonly cache: GlobalCacheManager;

  // Interaction managers
  public readonly command = new CommandManager();
  public readonly component = new ComponentManager();

  // Shorthands
  public readonly slash = this.command.slash;

  public constructor(config: BaseServerConfig & T) {
    this.api = new APIWrapper(config.token);
    this.cache = new GlobalCacheManager(this.api);

    if (config.registerCommands !== false && config.token)
      setTimeout(this.registerCommands, config.registerCommands ?? 10000);
  }

  /** Registers the server's commands with the Discord API. */
  public async registerCommands() {
    const slashConfig = this.slash.generateConfig();
    // const userConfig = this.user.generateConfig();
    // const messageConfig = this.message.generateConfig();

    const body = [...slashConfig /* , ...userConfig, ...messageConfig */];

    const app = (await this.api.get("/oauth2/applications/@me")) as App;
    await this.api.put(`/applications/${app.id}/commands`, { body });
  }

  /**
   * Parses a raw interaction data object, converts it to a suitable Interaction
   * class, executes the registered interaction handler, and returns a valid
   * raw interaction response object.
   *
   * @param d The raw interaction data to be processed.
   * @returns The interaction response (that is sent as an HTTP response).
   */
  protected async handleInteraction(d: RawInteraction): Promise<RawResponse> {
    let interactionType = Interaction;

    if (d.type === 2) interactionType = ApplicationCommandInteraction;
    if (d.type === 3) interactionType = MessageComponentInteraction;
    if (d.type === 4) interactionType = AutocompleteInteraction;
    if (d.type === 5) console; // temp

    const i = new interactionType(this.api, d);

    if (i.isPing()) return { type: 1 };
    if (i.isApplicationCommand()) return this.command.execute(i);
    if (i.isMessageComponent()) return this.component.execute(i);
    if (i.isApplicationCommandAutocomplete()) return this.command.complete(i);
    if (i.isModalSubmit()) console; // temp

    // Default for unimplemented interaction types
    return { type: 4, data: { content: "httpcord: unknown interaction type" } };
  }
}
