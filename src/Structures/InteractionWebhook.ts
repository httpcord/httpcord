import { Interaction } from ".";
import { APIWrapper } from "../API";
import {
  APIMessage,
  RESTPatchAPIWebhookWithTokenMessageJSONBody as JSONEditWebhook
} from "../Types";
import { Webhook } from "./Webhook";

export class InteractionWebhook extends Webhook {
  constructor(api: APIWrapper, interaction: Interaction) {
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
    return data as APIMessage;
  }

  async editOriginal(body: JSONEditWebhook) {
    const d = await this.api.patch(`${this.url}/messages/@original`, { body });
    return d as APIMessage;
  }

  async deleteOriginal() {
    await this.api.delete(`${this.url}/messages/@original`);
  }
}
