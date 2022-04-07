import type { APIWrapper } from "../../../API";
import type {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandAutocompleteResponse,
  APIApplicationCommandInteractionDataBasicOption,
  APIApplicationCommandOptionChoice,
  ApplicationCommandType
} from "../../../Types";
import { sleep } from "../../../Utils";
import { Interaction } from "../Interaction";
import { extractSubcommand } from "./ChatInput";

export class AutocompleteInteraction extends Interaction {
  rawData: APIApplicationCommandAutocompleteInteraction;
  response?: APIApplicationCommandAutocompleteResponse;

  commandId: string;
  commandName: string;
  commandType: ApplicationCommandType;

  isSubcommand = false;
  subcommandName?: string;

  options: APIApplicationCommandInteractionDataBasicOption[];
  locale: string;

  constructor(
    api: APIWrapper,
    data: APIApplicationCommandAutocompleteInteraction
  ) {
    super(api, data);
    const command = extractSubcommand(data.data);
    this.rawData = data;
    this.commandId = data.data.id;
    this.commandName = data.data.name;
    this.commandType = data.data.type;

    if (data.data.name !== command.name) {
      this.isSubcommand = true;
      this.subcommandName = command.name;
    }

    this.options =
      command.options as APIApplicationCommandInteractionDataBasicOption[];

    this.locale = data.locale;
  }

  /**
   * Waits until the interaction HTTP response is available then returns it.
   * WARNING: This has no timeout. Implement your own or risk waiting forever.
   */
  async awaitResponse() {
    while (!this.response) await sleep(200);
    return this.response;
  }

  /**
   * Use this to respond to the user with choices.
   * DO THIS AS SOON AS POSSIBLE, AUTOCOMPLETE INTERACTIONS CANNOT BE DEFERRED!!
   */
  respond(choices: APIApplicationCommandOptionChoice[]) {
    this.response = { type: 5, data: { choices } };
  }
}
