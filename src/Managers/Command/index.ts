import type {
  APIApplicationCommand,
  APIApplicationCommandInteraction as Interaction,
  ApplicationCommandInteractionResponse as Response
} from "../../Types";
import { RequiresToken, toInteraction } from "../../Utils";
import type { Manager } from "../Base";
import { ChatInputCommandManager } from "./Slash";

type Index = `${number}` | "_";
type Config = Map<Index, Map<string, APIApplicationCommand>>;

/** Manager that is responsible for handling application commands. */
export class CommandManager implements Manager<Interaction, Response> {
  /** Represents the scope of the manager. Either global ("_") or a Guild ID. */
  public readonly key: Index;
  /** The chat input sub-manager for registering chat input commands. */
  public readonly slash = new ChatInputCommandManager();

  /**
   * @param config If provided, makes this manager a "sub-manager".
   * @param key If provided, the key that will be used when storing in the map.
   * All requests to write a command will be forwarded to this config.
   */
  public constructor(key?: `${number}`) {
    this.key = key ?? "_";
  }

  public async execute(i: Interaction): Promise<Response> {
    let interactionType = toInteraction(i);

    return { type: 4, data: { content: "httpcord: unknown command type" } };
  }

  @RequiresToken
  public async sync() {}
}
