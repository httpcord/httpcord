import { APIInteraction } from "discord-api-types/v10";
import { BaseManager, BaseConfig } from "..";

export type CommandConfig = BaseConfig & {};

export class CommandManager {
  async execute(i: APIInteraction) {
    return { type: 1 };
  }
}
