import { ApplicationCommandInteraction } from "../../Structures";
import { BaseManager, BaseConfig } from "..";

export class CommandManager {
  async execute(i: ApplicationCommandInteraction) {
    return { type: 1 };
  }
}
