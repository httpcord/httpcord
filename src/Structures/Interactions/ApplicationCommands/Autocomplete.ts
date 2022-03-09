import { ApplicationCommandInteraction } from "./Base";
import { Interaction } from "../Interaction";
import APIManager from "../../../API";
import { APIApplicationCommandAutocompleteInteraction } from "../../../Types";

export class AutocompleteInteraction extends Interaction {
  constructor(
    api: APIManager,
    data: APIApplicationCommandAutocompleteInteraction
  ) {
    super(api, data);
  }
}
