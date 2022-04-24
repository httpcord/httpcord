import type {
  AutocompleteInteraction,
  ChatInputInteraction
} from "../../../Structures";
import type {
  APIApplicationCommandAutocompleteResponse as ACResponse,
  APIApplicationCommandBasicOption as BasicOption,
  ApplicationCommandInteractionResponse as Response,
  RESTPostAPIApplicationCommandsJSONBody as CommandData
} from "../../../Types";
import { CommandAcknowledgementType } from "../../../Types";
import { err } from "../../../Utils";
import { ApplicationCommand } from "../Structure";
import type { Localizations } from "../Types";
import type {
  AutocompleteCallback as ACCallback,
  ChatInputCallback as Callback,
  ChatInputCommandConfig as Config,
  ConfigurableOptions
} from "./Types";
import { convert, getFocused, getOptConfig } from "./Utils";

/** Represents a Chat Input (slash command) Application Command. */
export class ApplicationChatInputCommand<T> extends ApplicationCommand {
  // These will always be assigned in the "super()" call
  public readonly description!: string;
  public readonly descriptionLocalizations!: Localizations;

  /* ------------------------------------------------------------------------ */
  /* Configuration & Callbacks                                                */
  /* ------------------------------------------------------------------------ */

  /** The raw options that can be embedded in data sent to Discord. */
  public readonly options: ReadonlyArray<BasicOption> = [];
  /** The raw configuration that can be sent to Discord. */
  public readonly config: CommandData;

  /** The function that will be run when the command is executed. */
  public readonly callback: Callback<T>;
  /** The function that will be run when the command is autocompleted. */
  public readonly autocompleteCallback?: ACCallback<T>;

  /** The acknowledgement behavior of the command. */
  private readonly ackBehavior: CommandAcknowledgementType;
  /** Whether or not any options are required for the command to be executed. */
  private readonly anyOptionsRequired: boolean = false;

  /* ------------------------------------------------------------------------ */
  /* Consumer Methods                                                         */
  /* ------------------------------------------------------------------------ */

  public constructor(c: Config<T>, cb: Callback<T>, accb?: ACCallback<T>) {
    super(c);
    this.callback = cb;
    this.autocompleteCallback = accb;
    this.ackBehavior = c.ackBehavior ?? CommandAcknowledgementType.Auto;
    if (c.options) {
      const optsFn = c.options as unknown as ConfigurableOptions<T>;
      this.options = getOptConfig(optsFn);
      this.anyOptionsRequired = this.options.some((v) => v.required);
    }
    this.config = {
      name: typeof c.name === "string" ? c.name : c.name["en-US"],
      type: 1,
      options: this.options.slice(),
      description:
        typeof c.description === "string"
          ? c.description
          : c.description["en-US"],
    };
  }

  /**
   * Executes the command, handling timeouts and dealing with.
   * @param i The chat input interaction to pass to the function.
   * @returns The first (synchronous in a way) interaction response.
   */
  public async execute(i: ChatInputInteraction): Promise<Response> {
    // If any options are required and we have *not* received any, bail.
    if (this.anyOptionsRequired && (i.options?.length === 0 || !i.options)) {
      return err(4, "no options were received when some were expected");
    }

    const o = i.options ?? [];
    const opts = convert<T>(o, this.options.slice(0), true);

    const ephemeral =
      this.ackBehavior === 1 || (this.ackBehavior === 2 && i.isInGuild());

    switch (this.ackBehavior) {
      default:
        this.callback(i, opts); // Run in background
        setTimeout(() => i.defer(ephemeral), 1500);
      /* falls through */
      case CommandAcknowledgementType.Manual:
        return await i.awaitResponse();
    }
  }

  /**
   * Autocompletes the command.
   */
  public async complete(i: AutocompleteInteraction): Promise<ACResponse> {
    // If any options are required and we have *not* received any, bail.
    if (this.anyOptionsRequired && (i.options?.length === 0 || !i.options)) {
      return err(5, "no options were received when some were expected");
    } else if (!this.autocompleteCallback) {
      return err(5, "no autocomplete callback was registered");
    }

    const options = i.options ?? [];
    const opts = convert<T>(options, this.options.slice(0), false);
    const focused = getFocused<T>(i.options);
    if (!focused) return err(5, "no option is focused, how are you here?");

    this.autocompleteCallback(i, focused, opts);

    setTimeout(() => i.respond([]), 10000); // to prevent getting stuck
    return await i.awaitResponse();
  }
}
