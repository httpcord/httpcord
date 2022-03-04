import {
  ApplicationCommandInteraction,
  ChatInputInteraction,
} from "../../Structures";
import { ApplicationCommandInteractionResponse } from "../../Types/";
import { ChatInputCommandManager } from "./ChatInput";

export class CommandManager {
  readonly slash = new ChatInputCommandManager();

  async execute(
    i: ApplicationCommandInteraction
  ): Promise<ApplicationCommandInteractionResponse> {
    let interactionType = ApplicationCommandInteraction;

    if (i.commandType === 1) interactionType = ChatInputInteraction;

    const int = new interactionType(i.server, i.rawData);

    if (int.isChatInputCommand()) return await this.slash.execute(int);

    return { type: 4, data: { content: "httpcord: unknown command type" } };
  }
}
