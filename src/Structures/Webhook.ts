import type { APIWrapper } from "../API";
import type {
  APIInteractionWebhook,
  APIMessage,
  APIWebhook,
  RESTPatchAPIWebhookWithTokenMessageJSONBody as JSONEditWebhook,
  RESTPostAPIWebhookWithTokenJSONBody as JSONExecuteWebhook,
  WebhookType
} from "../Types";

export class Webhook {
  protected api: APIWrapper;
  protected token: string;

  id: string;
  type: WebhookType;
  applicationId?: string;
  url: `/webhooks/${string}/${string}`;

  guildId?: string;
  channelId?: string;
  name?: string;

  constructor(api: APIWrapper, data: APIInteractionWebhook, token: string) {
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

  static async fromToken(api: APIWrapper, id: string, token: string) {
    const data = (await api.get(`/webhooks/${id}/${token}`)) as APIWebhook;
    return new Webhook(api, data, token);
  }

  async execute(body: JSONExecuteWebhook) {
    const data = await this.api.post(this.url, { body });
    return data as APIMessage;
  }

  async getMessage(id: string) {
    const data = await this.api.get(`${this.url}/messages/${id}`);
    return data as APIMessage;
  }

  async editMessage(id: string, body: JSONEditWebhook) {
    const data = await this.api.patch(`${this.url}/messages/${id}`, { body });
    return data as APIMessage;
  }

  async deleteMessage(id: string) {
    await this.api.delete(`${this.url}/messages/${id}`);
  }
}
