import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseDeferredChannelMessageWithSource,
  APIMessageComponentInteraction,
  APIModalInteractionResponse,
  APIModalSubmitInteraction,
  APIWebhook,
} from "./DiscordAPITypes";

export type APIChatInputInteractionResponse =
  | APIModalInteractionResponse
  | APIInteractionResponseChannelMessageWithSource
  | APIInteractionResponseDeferredChannelMessageWithSource;

export type APIUserInitiatedInteraction =
  | APIApplicationCommandInteraction
  | APIApplicationCommandAutocompleteInteraction
  | APIMessageComponentInteraction
  | APIModalSubmitInteraction;

export type APIInteractionWebhook = Partial<APIWebhook> &
  Pick<APIWebhook, "id"> &
  Pick<APIWebhook, "type">;
