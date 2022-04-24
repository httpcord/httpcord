import type {
  APIApplicationCommandAutocompleteInteraction as IAutocomplete,
  APIChatInputApplicationCommandInteraction as Interaction,
  ApplicationCommandInteractionResponse as Response,
  RESTPostAPIApplicationCommandsJSONBody
} from "../../../Types";
import type { Manager } from "../../Base";
import { ApplicationChatInputCommand as Command } from "./Structure";
import type {
  AutocompleteCallback as ACCallback,
  ChatInputCallback as Callback,
  ChatInputCommandConfig as Config
} from "./Types";

export class ChatInputCommandManager implements Manager<Interaction, Response> {
  private readonly registered = new Map<string, Command<any>>();

  public register<T>(config: Config<T>, fn: Callback<T>, acfn?: ACCallback<T>) {
    const command = new Command(config, fn, acfn);
    this.registered.set(command.name, command);
    return command;
  }

  async execute(i: Interaction): Promise<Response> {
    const flags = 64; // ephemeral
    return { type: 4, data: { content: "httpcord: unknown command", flags } };
  }

  async autocomplete(i: IAutocomplete) {
    return { type: 5, data: { choices: [] } };
  }

  generateConfig() {
    const config: RESTPostAPIApplicationCommandsJSONBody[] = [];
    for (const [name, command] of this.registered) {
      config.push(command.config);
    }
    return config;
  }
}
