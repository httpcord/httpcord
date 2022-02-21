import APIManager from "../../API";
import { InteractionServer } from "../../InteractionServer";
import {
  APIInteraction,
  APIInteractionGuildMember,
  APIMessage,
  APIUser,
  InteractionType,
} from "../../Types";
import { ApplicationCommandInteraction } from "./ApplicationCommands";
import { Webhook } from "..";
import { InteractionWebhook } from "..";
export class Interaction {
  protected api: APIManager;
  protected webhook: Webhook;

  id: string;
  token: string;
  applicationId: string;
  type: APIInteraction["type"];
  data: APIInteraction["data"];

  channelId?: string;
  guildId?: string;
  guildLocale?: string;

  message?: APIMessage;
  user?: APIUser;
  member?: APIInteractionGuildMember;

  constructor(server: InteractionServer, data: APIInteraction) {
    this.api = server.api;

    this.id = data.id;
    this.token = data.token;
    this.applicationId = data.application_id;
    this.type = data.type;
    this.data = data.data;

    this.channelId = data.channel_id;
    this.guildId = data.guild_id;
    this.guildLocale = data.guild_locale;

    this.message = data.message;
    this.user = data.user;
    this.member = data.member;

    this.webhook = new InteractionWebhook(this.api, this);
  }

  isPing() {
    return this.type === InteractionType.Ping;
  }

  isApplicationCommand(): this is ApplicationCommandInteraction {
    return this.type === InteractionType.ApplicationCommand;
  }

  isMessageComponent() {
    return this.type === InteractionType.MessageComponent;
  }

  isApplicationCommandAutocomplete() {
    return this.type === InteractionType.ApplicationCommandAutocomplete;
  }

  isModalSubmit() {
    return this.type === InteractionType.ModalSubmit;
  }
}

export * from "./ApplicationCommands";
