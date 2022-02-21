import { Interaction, InteractionWebhook } from "../..";
import { InteractionServer } from "../../../InteractionServer";
import {
  APIApplicationCommandInteraction,
  ApplicationCommandType,
  RESTPostAPIInteractionFollowupJSONBody as RESTEditWebhook,
} from "../../../Types";

export class ApplicationCommandInteraction extends Interaction {
  webhook: InteractionWebhook;

  locale: string;
  commandId: string;
  commandName: string;
  commandType: ApplicationCommandType;
  replied = false;
  ephemeral = null;

  constructor(
    server: InteractionServer,
    data: APIApplicationCommandInteraction
  ) {
    super(server, data);
    this.locale = data.locale;
    this.commandId = data.data.id;
    this.commandName = data.data.name;
    this.commandType = data.data.type;

    this.webhook = new InteractionWebhook(this.api, this);
  }

  async respond(msg: string | RESTEditWebhook) {
    if (typeof msg === "string") msg = { content: msg };
    if (this.replied) return await this.webhook.execute(msg);
    return await this.webhook.editOriginal(msg);
  }

  async respondEphemeral(msg: string | RESTEditWebhook) {
    if (typeof msg === "string") msg = { content: msg };
    msg = { ...msg, flags: 64 };
    if (this.replied) return await this.webhook.execute(msg);
    return await this.webhook.editOriginal(msg);
  }

  async editMessage(id: string, msg: string | RESTEditWebhook) {
    if (typeof msg === "string") msg = { content: msg };
    return await this.webhook.editMessage(id, msg);
  }

  async editOriginal(msg: string | RESTEditWebhook) {
    if (typeof msg === "string") msg = { content: msg };
    return await this.webhook.editOriginal(msg);
  }

  isChatInputCommand() {
    return this.commandType === ApplicationCommandType.ChatInput;
  }

  isUserCommand() {
    return this.commandType === ApplicationCommandType.User;
  }

  isMessageCommand() {
    return this.commandType === ApplicationCommandType.Message;
  }
}
