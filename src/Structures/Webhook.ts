import type {
  APIInteractionWebhook,
  APIMessage,
  APIWebhook,
  RESTPatchAPIWebhookWithTokenMessageJSONBody as JSONEditWebhook,
  RESTPostAPIWebhookWithTokenJSONBody as JSONExecuteWebhook,
  Snowflake,
  WebhookType
} from "../Types";
import type { ServerLike } from "./Base";
import { Structure } from "./Base";

/** Represents a Webhook from Discord. */
export class Webhook extends Structure {
  protected readonly token: string;
  protected readonly url: `/webhooks/${string}/${string}`;

  /** The unique ID of this webhook. */
  public readonly id: Snowflake;
  /** The type of this webhook. */
  public readonly type: WebhookType;
  /** The ID of the application that created this webhook, if any. */
  public readonly applicationId?: Snowflake;
  /** The ID of the guild that the webhook belongs to, if available. */
  public readonly guildId?: Snowflake;
  /** The ID of the channel that the webhook belongs to, if available. */
  public readonly channelId?: Snowflake;
  /** The name of the webhook, if available. */
  public readonly name?: string;

  public constructor(server: ServerLike, d: APIInteractionWebhook, t: string) {
    super(server);
    this.id = d.id as Snowflake;
    this.token = t;
    this.url = `/webhooks/${this.id}/${this.token}`;

    this.type = d.type;
    this.applicationId = (d.application_id as Snowflake) || undefined;

    this.channelId = d.channel_id as Snowflake;
    this.guildId = d.guild_id as Snowflake;
    this.name = d.name || undefined;
  }

  /** Creates a new webhook from a webhook ID and token by fetching the data. */
  public static async fromToken(server: ServerLike, id: string, token: string) {
    const d = (await server.api.get(`/webhooks/${id}/${token}`)) as APIWebhook;
    return new Webhook(server, d, token);
  }

  /** Executes the webhook (i.e. sends a message). */
  public async execute(body: JSONExecuteWebhook) {
    const data = await this.api.post(this.url, { body });
    return data as APIMessage;
  }

  /** Gets a message that was previously sent by the webhook. */
  public async getMessage(id: string) {
    const data = await this.api.get(`${this.url}/messages/${id}`);
    return data as APIMessage;
  }

  /** Edits a message that was previously sent by the webhook. */
  public async editMessage(id: string, body: JSONEditWebhook) {
    const data = await this.api.patch(`${this.url}/messages/${id}`, { body });
    return data as APIMessage;
  }

  /** Deletes a message that was previously sent by the webhook. */
  public async deleteMessage(id: string) {
    await this.api.delete(`${this.url}/messages/${id}`);
  }
}
