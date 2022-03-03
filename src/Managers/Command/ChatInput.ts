import { APIChatInputApplicationCommandInteraction } from "../../Types";
import { BaseManager } from "..";

export type ChatInputCommandConfig = {
  name: string;
  description?: string;
};

export type ChatInputCommandCallback = (
  i: APIChatInputApplicationCommandInteraction
) => unknown;

export class ChatInputCommandManager {
  private registered: Map<
    string,
    ChatInputCommandConfig & { fn: ChatInputCommandCallback }
  > = new Map();

  register(config: ChatInputCommandConfig, fn: ChatInputCommandCallback) {
    this.registered.set(config.name, { ...config, fn });
  }

  async execute();
}
