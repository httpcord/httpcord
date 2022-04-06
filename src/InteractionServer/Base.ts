import { APIWrapper } from "../API";
import { CommandManager, ComponentManager } from "../Managers";
import { JSONBody, Raw, Verify } from "../Middleware";
import {
  ApplicationCommandInteraction,
  AutocompleteInteraction,
  Interaction,
  MessageComponentInteraction
} from "../Structures";
import {
  APIApplication as App,
  APIInteraction,
  APIInteractionResponse
} from "../Types";
import { InteractionServerConfig } from "./Config";

const respond = (t: Record<string, any>) => new Response(JSON.stringify(t));

/**
 * Represents an interaction server. It takes a public key (and optionally bot
 * token) and in return gives a bare-bones interaction server. Use it by calling
 * InteractionServer#handleRequest to handle FetchAPI-compliant request/response
 * or go more low-level with InteractionServer#handleInteraction for more
 * granular control, allowing you to use it pretty much anywhere JavaScript runs
 */
export class InteractionServer {
  protected api: APIWrapper;
  protected command = new CommandManager();
  private verify: ReturnType<typeof Verify>;

  // Shorthands for registering interactions
  readonly slash = this.command.slash;
  readonly component = new ComponentManager();

  /**
   * Creates a new interaction server.
   * @param {InteractionServerConfig} Config - the configuration to use
   */
  constructor(config: InteractionServerConfig) {
    this.verify = Verify(config.publicKey);
    this.api = new APIWrapper(config.token);

    if (config.registerCommands !== false && config.token) {
      const timeout = config.registerCommands || 10000;
      setTimeout(this.registerCommands.bind(this), timeout);
    }
  }

  async registerCommands() {
    const slashConfig = this.slash.generateConfig();
    // const userConfig = this.user.generateConfig();
    // const messageConfig = this.message.generateConfig();

    const body = [...slashConfig /* , ...userConfig, ...messageConfig */];

    const app = (await this.api.get("/oauth2/applications/@me")) as App;
    await this.api.put(`/applications/${app.id}/commands`, { body });
  }

  /**
   * Handles an incoming request. Returns a Response object.
   * Unlike InteractionServer#handleInteraction, this method does verification
   * for you based on what you put for publicKey.
   * This allows the server to be used in serverless environments like CF
   * Workers or Deno Deploy.
   */
  async handleRequest(r: Request): Promise<Response> {
    // Verify
    const rawBody = await Raw(r);
    const isVerified = this.verify(r, rawBody);

    if (!isVerified) return new Response("Unauthorized", { status: 401 });

    const data = await JSONBody(rawBody);
    if (!data) return new Response("No body", { status: 400 });

    return respond(await this.handleInteraction(data));
  }

  /**
   * More low-level function if you want to handle verification and parsing
   * yourself.
   *
   * WARNING: There is no checks for authentication, even with publicKey set
   * in config!!!!!!! Your server will allow anyone to forge fake interactions
   * from ANYONE with ANYTHING if you fail to verify properly!!!
   */
  async handleInteraction(d: APIInteraction): Promise<APIInteractionResponse> {
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
