import { REST } from "@httpcord/rest";

export class APIWrapper {
  private rest = new REST();

  constructor(token?: string) {
    this.rest.setToken(token);
  }

  get = this.rest.get;
  post = this.rest.post;
  patch = this.rest.patch;
  put = this.rest.put;
  delete = this.rest.delete;
}
