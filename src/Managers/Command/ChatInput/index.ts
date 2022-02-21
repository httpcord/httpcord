import {
  APIChatInputApplicationCommandInteraction,
  APIChatInputInteractionResponse,
} from "../../../Types";

type Callback = (i: APIChatInputApplicationCommandInteraction) => unknown;
type Config = { name: string; ephemeral?: boolean };

export class ChatInputManager {
  private registered: Map<string, Config & { fn: Callback }> = new Map();
  register(c: Config, fn: Callback) {
    this.registered.set(c.name, { ...c, fn });
  }

  async execute(
    i: APIChatInputApplicationCommandInteraction
  ): Promise<APIChatInputInteractionResponse> {
    const data = this.registered.get(i.data.name);
    if (data) {
      data.fn(i);
      return { type: 5, data: { flags: data.ephemeral ? 64 : 0 } };
    }
    return { type: 4, data: { content: "Unknown slash command." } };
  }
}
