import type Express from "express";
import { EJSONBody, ERaw, EVerify } from "../Middleware";
import { InteractionServer } from "./Base";
import type { ExpressServerConfig } from "./Config";

/**
 * This is a server that uses Express under the hood instead of Fetch API
 * request and response objects. Note that httpcord has no dependency on Express
 * itself, therefore you need to install, make the app and pass it yourself.
 */
export class ExpressServer extends InteractionServer {
  constructor(config: ExpressServerConfig) {
    super(config);
    const verify = EVerify(config.publicKey);
    const respond = this.resp.bind(this);

    if ("app" in config) {
      config.app.post(config.url || "/", ERaw, verify, EJSONBody, respond);
    } else {
      config.router.post("/", ERaw, verify, EJSONBody, respond);
    }
  }

  private async resp(req: Express.Request, res: Express.Response) {
    return res.json(await this.handleInteraction(req.body));
  }
}
