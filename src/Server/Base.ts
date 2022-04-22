import { APIWrapper } from "../API";
import { GlobalCacheManager } from "../Cache";
import { CommandManager } from "../Managers";
import type {
  APIApplication as App,
  APIInteraction,
  APIInteractionResponse as Response
} from "../Types";
import { InteractionType as Type } from "../Types";
import { Errors } from "../Utils";
import type { BaseServerConfig } from "./Types";

/** Base interaction server that other server types all extend. */
export abstract class BaseServer<T = BaseServerConfig> {
  /** The API manager of the server that interfaces with the Discord HTTP API */
  public readonly api: APIWrapper;
  /** The server's global cache, that keeps all data it receives. */
  public readonly cache: GlobalCacheManager;

  // Interaction managers
  public readonly command = new CommandManager();
  // public readonly component = new ComponentManager();

  // Shorthands
  public readonly slash = this.command.slash;

  public constructor(config: BaseServerConfig & T) {
    this.api = new APIWrapper(config.token);
    this.cache = new GlobalCacheManager(this);

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
  protected async handleInteraction(d: APIInteraction): Promise<Response> {
    switch (d.type) {
      case Type.Ping:
        return { type: 1 };

      case Type.ApplicationCommand:
      case Type.MessageComponent:
      case Type.ApplicationCommandAutocomplete:
      case Type.ModalSubmit:
      default:
        return Errors.UNKNOWN_INTERACTION;
    }
  }
}
