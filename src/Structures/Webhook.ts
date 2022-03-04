import APIManager from "../API";
import {
  APIInteractionWebhook,
  APIMessage,
  RESTPatchAPIWebhookWithTokenMessageJSONBody as JSONEditWebhook,
  RESTPostAPIWebhookWithTokenJSONBody as JSONExecuteWebhook,
  WebhookType,
} from "../Types";

export class Webhook {
  protected api: APIManager;
  protected token: string;

  id: string;
  type: WebhookType;
  applicationId?: string;
  url: `/webhooks/${string}/${string}`;

  guildId?: string;
  channelId?: string;
  name?: string;

  constructor(api: APIManager, data: APIInteractionWebhook, token: string) {
    this.api = api;
    this.token = token;

    this.id = data.id;
    this.type = data.type;
    this.applicationId = data.application_id || undefined;
    this.url = `/webhooks/${this.id}/${this.token}`;

    this.channelId = data.channel_id;
    this.guildId = data.guild_id;
    this.name = data.name || undefined;
  }

  static async fromToken(api: APIManager, id: string, token: string) {
    const data = await api.get(`/webhooks/${id}/${token}`);
    return new Webhook(api, data.data, token);
  }

  async execute(d: JSONExecuteWebhook) {
    const data = await this.api.post(this.url, d);
    if (data.status < 300) return data.data as APIMessage;
  }

  async getMessage(id: string) {
    const data = await this.api.get(`${this.url}/messages/${id}`);
    if (data.status < 300) return data.data as APIMessage;
  }

  async editMessage(id: string, d: JSONEditWebhook) {
    const data = await this.api.patch(`${this.url}/messages/${id}`, d);
    if (data.status < 300) return data.data as APIMessage;
  }

  async deleteMessage(id: string) {
    const data = await this.api.delete(`${this.url}/messages/${id}`);
    return data.status < 300;
  }
}
