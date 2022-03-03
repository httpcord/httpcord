import { Interaction, InteractionWebhook } from "..";
import { InteractionServer } from "../../InteractionServer";
import {
  APIMessageComponentInteraction,
  ApplicationCommandType,
  RESTPostAPIInteractionFollowupJSONBody as RESTEditWebhook,
  ComponentType,
} from "../../Types";

/** Represents a message component interaction sent from a text message. */
export class MessageComponentInteraction extends Interaction {
  webhook: InteractionWebhook;

  locale: string;
  customId: string;
  componentType: ComponentType;
  selected: string[] | null = null;

  /** Whether the interaction has been responded to with an actual message. */
  replied = false;
  /** Whether the interaction has been deferred. */
  deferred = false;
  /** Whether the original response/deferral was ephemeral or not. */
  ephemeral = null;

  constructor(server: InteractionServer, data: APIMessageComponentInteraction) {
    super(server, data);
    this.locale = data.locale;
    this.customId = data.data.custom_id;
    this.componentType = data.data.component_type;
    if (data.data.component_type === 3) this.selected = data.data.values;

    this.webhook = new InteractionWebhook(this.api, this);
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

    if (!this.deferred && !this.replied) {
      this.replied = true;
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
      this.response = { type: 4, data: msg };
    }
  }

  /** True if this is a button interaction */
  isButton() {
    return this.componentType === ComponentType.Button && !this.selected;
  }

  /** True if this is a select menu interaction */
  isSelectMenu() {
    return this.componentType === ComponentType.SelectMenu && this.selected;
  }
}
