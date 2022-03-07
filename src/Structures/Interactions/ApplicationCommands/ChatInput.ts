import APIManager from "../../../API";
import { ApplicationCommandInteraction } from "./Base";
import {
  APIApplicationCommandInteractionDataBasicOption,
  APIApplicationCommandInteractionDataSubcommandOption,
  APIApplicationCommandInteractionDataSubcommandGroupOption,
  APIChatInputApplicationCommandInteractionData,
  APIChatInputApplicationCommandInteraction,
} from "../../../Types";

type CommandData =
  | APIChatInputApplicationCommandInteractionData
  | APIApplicationCommandInteractionDataSubcommandOption
  | APIApplicationCommandInteractionDataSubcommandGroupOption;

function extractSubcommand(d: CommandData): CommandData {
  const options = d.options;
  if (options?.length !== 1) return d; // Either no options or more than 1

  const firstOption = options[0];
  if (firstOption.type !== 1 && firstOption.type !== 2) return d;

  return extractSubcommand(firstOption);
}

export class ChatInputInteraction extends ApplicationCommandInteraction {
  options?: APIApplicationCommandInteractionDataBasicOption[];
  isSubcommand = false;
  subcommandName?: string;

  constructor(
    api: APIManager,
    data: APIChatInputApplicationCommandInteraction
  ) {
    super(api, data);
    const command = extractSubcommand(data.data);
    this.options =
      command.options as APIApplicationCommandInteractionDataBasicOption[];

    // this will break if the subcommand is same name as group, e.g. /test test
    if (data.data.name !== command.name) {
      this.isSubcommand = true;
      this.subcommandName = command.name;
    }
  }
}
