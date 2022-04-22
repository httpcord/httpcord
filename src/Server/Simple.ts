import type { APIInteraction } from "../Types";
import { BaseServer } from "./Base";

/**
 * Simple server that exposes the low-level handle interaction API, allowing
 * infinite flexibility in how interactions are delivered to the server.
 */
export class SimpleServer extends BaseServer {
  public async handleInteraction(d: APIInteraction) {
    return await super.handleInteraction(d)
  }
}
