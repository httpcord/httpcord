import { InteractionWebhook } from "../..";
import APIManager from "../../../API";
import {
  APIApplicationCommandInteraction,
  ApplicationCommandInteractionResponse,
  ApplicationCommandType,
  RESTPostAPIInteractionFollowupJSONBody as RESTEditWebhook,
} from "../../../Types";
import { sleep } from "../../../Utils";
import { Interaction } from "../Interaction";
import { ResolvedManager } from "../ResolvedManager";

export class ApplicationCommandInteraction extends Interaction {
  protected resolved?: ResolvedManager;
  protected webhook: InteractionWebhook;
  rawData: APIApplicationCommandInteraction;

  locale: string;
  commandId: string;
  commandName: string;
  commandType: ApplicationCommandType;
  response?: ApplicationCommandInteractionResponse;

  /** Whether the interaction has been responded to with an actual message. */
  replied = false;
  /** Whether the interaction has been deferred. */
  deferred = false;
  /** Whether the original response/deferral was ephemeral or not. */
  ephemeral?: boolean;

  constructor(api: APIManager, data: APIApplicationCommandInteraction) {
    super(api, data);
    this.rawData = data;
    this.locale = data.locale;
    this.commandId = data.data.id;
    this.commandName = data.data.name;
    this.commandType = data.data.type;

    if ("resolved" in data.data && data.data.resolved !== undefined)
      this.resolved = new ResolvedManager(data.data.resolved);

    this.webhook = new InteractionWebhook(this.api, this);
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
   * Defers the interaction. The user sees a "loading" state.
   */
  defer(ephemeral?: boolean) {
    if (this.replied || this.deferred) return;
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

  /** Gets a cached user. */
  getUser(id: string) {
    if (this.resolved) return this.resolved.user(id);
  }

  /** Gets a cached member. */
  getMember(id: string) {
    if (this.resolved) return this.resolved.member(id);
  }

  /** Gets a cached role. */
  getRole(id: string) {
    if (this.resolved) return this.resolved.role(id);
  }

  /** Gets a cached channel. */
  getChannel(id: string) {
    if (this.resolved) return this.resolved.channel(id);
  }

  /** Gets a cached message. */
  getMessage(id: string) {
    if (this.resolved) return this.resolved.message(id);
  }

  /** Gets a cached attachment. */
  getAttachment(id: string) {
    if (this.resolved) return this.resolved.attachment(id);
  }

  /** True if this is a ChatInputInteraction */
  isChatInputCommand(): this is import("./ChatInput").ChatInputInteraction {
    return this.commandType === ApplicationCommandType.ChatInput;
  }

  /** True if this is a UserInteraction */
  isUserCommand() {
    return this.commandType === ApplicationCommandType.User;
  }

  /** True if this is a MessageInteraction */
  isMessageCommand() {
    return this.commandType === ApplicationCommandType.Message;
  }
}

export * from "./ChatInput";
