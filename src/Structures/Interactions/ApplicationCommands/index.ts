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

  /** Whether the interaction has been responded to with an actual message. */
  replied = false;
  /** Whether the interaction has been deferred. */
  deferred = false;
  /** Whether the original response/deferral was ephemeral or not. */
  ephemeral?: boolean;

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

  /**
   * Defers the interaction. The user sees a "loading" state.
   */
  defer(ephemeral?: boolean) {
    this.deferred = true;
    this.ephemeral = ephemeral || false;
    this.response = { type: 5, data: { flags: ephemeral ? 64 : 0 } };
  }

  /**
   * Edits a message with a given ID. Note that ephemeral messages can't be
   * edited as they do not have an ID.
   */
  async editMessage(id: string, msg: string | RESTEditWebhook) {
    if (typeof msg === "string") msg = { content: msg };
    return await this.webhook.editMessage(id, msg);
  }

  /**
   * Edits the original message. Note that ephemeral messages can't be edited
   * as they do not have an ID, unless the message being edited is the deferral
   * message. Attempting to edit an ephemeral message will throw an error.
   */
  async editOriginal(msg: string | RESTEditWebhook) {
    // We have to have something to edit
    if (!this.replied || !this.deferred)
      throw new Error("Interaction not deferred or replied.");

    // Can't edit if we already replied and it's ephemeral
    if (this.replied && this.ephemeral)
      throw new Error("Cannot edit ephemeral message.");

    if (typeof msg === "string") msg = { content: msg };
    if (!this.replied && this.deferred) this.replied = true;
    return await this.webhook.editOriginal(msg);
  }

  /** Deletes a message with an ID. Ephemeral messages can't be deleted. */
  async deleteMessage(id: string) {
    return await this.webhook.deleteMessage(id);
  }

  /** Deletes the original message. Ephemeral messages can't be deleted. */
  async deleteOriginal() {
    if (!this.replied) throw new Error("No original message sent");
    if (this.ephemeral) throw new Error("Can't delete ephemeral message");
    return await this.webhook.deleteOriginal();
  }

  /**
   * Creates a follow-up message. Will fail if the interaction hasn't been
   * responded to.
   */
  async followUp(msg: string | RESTEditWebhook) {
    if (!this.replied) throw new Error("Cannot follow up before responding");
    if (typeof msg === "string") msg = { content: msg };
    return await this.webhook.execute(msg);
  }

  /**
   * General response method that either edits the deferral message or creates
   * a follow-up.
   */
  async respond(msg: string | RESTEditWebhook) {
    if (typeof msg === "string") msg = { content: msg };
    if (msg.flags) throw new Error("Unsupported, use respondEphemeral instead");

    if (!this.deferred && !this.replied) {
      this.replied = true;
      this.ephemeral = false;
      this.response = { type: 4, data: msg };
      return await this.webhook.getOriginal();
    } else if (this.deferred && !this.replied) {
      this.replied = true;
      return await this.webhook.editOriginal(msg);
    }

    return await this.webhook.execute(msg);
  }

  /**
   * Like MessageComponentInteraction#respond but tries to respond ephemerally.
   * Guaranteed an ephemeral message - good for sensitive info only for sender.
   * Will throw an error if trying to edit a defer that is non-ephemeral.
   */
  async respondEphemeral(msg: string | RESTEditWebhook) {
    if (!this.replied && this.deferred && !this.ephemeral)
      throw new Error("Cannot respond ephemerally to non-ephemeral defer");

    if (typeof msg === "string") msg = { content: msg };
    msg = { ...msg, flags: 64 };

    if (!this.deferred && !this.replied) {
      this.replied = true;
      this.ephemeral = true;
      this.response = { type: 4, data: msg };
      return await this.webhook.getOriginal();
    } else if (this.deferred && !this.replied) {
      this.replied = true;
      return await this.webhook.editOriginal(msg);
    }

    return await this.webhook.execute(msg);
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
