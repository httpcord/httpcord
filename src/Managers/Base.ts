import type {
  APIInteraction as I,
  APIInteractionResponse as R
} from "../Types";

/** Generic manager that every other manager extends. */
export interface Manager<Data extends I, Response extends R> {
  /**
   * Finds the internal function that handles the interaction and executes it,
   * returning the result. If no function is found, a properly formatted "error
   * message" is returned instead.
   * @param interaction The interaction to be processed
   * @returns The (initial) response to the interaction.
   */
  execute(interaction: Data): Promise<Response>;
}
