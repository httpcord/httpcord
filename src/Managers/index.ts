import {
  APIInteraction as Interaction,
  APIInteractionResponse as Response,
} from "discord-api-types/v10";

export type BaseConfig = {
  name: string;
};

export interface BaseManager<T extends BaseConfig, C> {
  register(config: T, cb: (i: Interaction) => C): void;
  execute(i: Interaction): Response | Promise<Response>;
}
