import { InteractionWebhook, Member, Message, User, Webhook } from "..";
import APIManager from "../../API";
import {
  APIInteraction,
  APIInteractionResponse,
  InteractionType,
} from "../../Types";
import { sleep } from "../../Utils";

/** Represents a generic interaction. */
export class Interaction {
  rawData: APIInteraction;
  api: APIManager;
  protected webhook: Webhook;

  id: string;
  token: string;
  applicationId: string;
  type: APIInteraction["type"];
  data: APIInteraction["data"];

  channelId?: string;
  guildId?: string;
  guildLocale?: string;

  message?: Message;
  user?: User;
  member?: Member;
  response?: APIInteractionResponse;

  constructor(api: APIManager, data: APIInteraction) {
    this.rawData = data;
    this.api = api;

    this.id = data.id;
    this.token = data.token;
    this.applicationId = data.application_id;
    this.type = data.type;
    this.data = data.data;

    this.channelId = data.channel_id;
    this.guildId = data.guild_id;
    this.guildLocale = data.guild_locale;

    if (data.message) this.message = new Message(data.message);
    if (data.user) this.user = new User(data.user);
    if (data.member)
      this.member = new Member(data.member, new User(data.member.user));

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

  /** True if the interaction was ran in DMs. */
  isInDM() {
    return !!this.user;
  }

  /** True if the interaction was ran in a server. */
  isInServer() {
    return !!this.member;
  }

  /**
   * True if this is a ping interaction (i.e. type === 1).
   * You should never have to deal with these as the framework does it for you.
   */
  isPing() {
    return this.type === InteractionType.Ping;
  }

  /** True if this is an ApplicationCommandInteraction */
  isApplicationCommand(): this is import("./ApplicationCommands").ApplicationCommandInteraction {
    return this.type === InteractionType.ApplicationCommand;
  }

  /** True if this is a MessageComponentInteraction */
  isMessageComponent(): this is import("./MessageComponent").MessageComponentInteraction {
    return this.type === InteractionType.MessageComponent;
  }

  /** True if this is an ApplicationCommandAutocompleteInteraction */
  isApplicationCommandAutocomplete() {
    return this.type === InteractionType.ApplicationCommandAutocomplete;
  }

  /** True if this is a ModalSubmitInteraction */
  isModalSubmit() {
    return this.type === InteractionType.ModalSubmit;
  }
}
