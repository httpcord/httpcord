import { Webhook } from "./Webhook";
import { Interaction } from ".";
import APIManager from "../API";
import {
  APIMessage,
  APIInteractionResponse,
  RESTPatchAPIWebhookWithTokenMessageJSONBody as JSONEditWebhook,
} from "../Types";

export class InteractionWebhook extends Webhook {
  constructor(api: APIManager, interaction: Interaction) {
    super(
      api,
      {
        id: interaction.id,
        type: 3,
        application_id: interaction.applicationId,
      },
      interaction.token
    );
  }

  async getOriginal() {
    const data = await this.api.post(`${this.url}/messages/@original`);
    if (data.status < 300) return data.data as APIMessage;
  }

  async editOriginal(d: JSONEditWebhook) {
    const data = await this.api.patch(`${this.url}/messages/@original`, d);
    if (data.status < 300) return data.data as APIMessage;
  }

  async deleteOriginal() {
    const data = await this.api.delete(`${this.url}/messages/@original`);
    return data.status < 300;
  }
}
