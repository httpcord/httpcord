import Express from "express";
import { InteractionServer } from ".";
import { ERaw, EVerify, EJSONBody } from "../Middleware";
import { ExpressServerConfig } from "./Config";

/**
 * This is a server that uses Express under the hood instead of Fetch API
 * request and response objects. Note that httpcord has no dependency on Express
 * itself, therefore you need to install, make the app and pass it yourself.
 */

export class ExpressServer extends InteractionServer {
  readonly listen?: Express.Application["listen"];

  constructor(config: ExpressServerConfig) {
    super(config);
    const verify = EVerify(config.publicKey);

    if ("app" in config) {
      config.app.post(config.url || "/", ERaw, verify, EJSONBody, this.resp);
    } else if ("router" in config) {
      config.router.post("/", ERaw, verify, EJSONBody, this.resp);
    } else {
      const app = Express();
      app.post("/", ERaw, EVerify(config.publicKey), EJSONBody, this.resp);
      this.listen = app.listen;
    }
  }

  private async resp(req: Express.Request, res: Express.Response) {
    return res.json(await this.handleInteraction(req.body));
  }
}