import { BaseServer } from "./Base";
import { JSONBody, Raw, Verify } from "./Middleware";
import type { BaseServerConfig } from "./Types";

/** A helper function that turns an object into a JSON response. */
const respond = (t: Record<string, any>) => new Response(JSON.stringify(t));

/** A Fetch-compliant interaction server. */
export class FetchServer extends BaseServer {
  // Store the verify function once after we generate it with the public key
  private readonly verify: ReturnType<typeof Verify>;

  constructor(config: BaseServerConfig) {
    super(config);
    this.verify = Verify(config.publicKey);
  }

  /**
   * Responds to a Fetch-compliant Request with a Response. Verification and
   * parsing is all done for you, all you have to do is get the response sent
   * back to the client.
   */
  public async handleRequest(req: Request) {
    const rawBody = await Raw(req);
    const isVerified = this.verify(req, rawBody);

    if (!isVerified) return new Response("Unauthorized", { status: 401 });

    const data = await JSONBody(rawBody);
    if (!data) return new Response("No body", { status: 400 });

    return respond(await this.handleInteraction(data));
  }
}
