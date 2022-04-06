import { REST } from "@httpcord/rest";

export class APIWrapper {
  private rest = new REST();
  hasToken = false;

  constructor(token?: string) {
    this.rest.setToken(token);
    this.hasToken = !!token;
  }

  get = this.rest.get;
  post = this.rest.post;
  patch = this.rest.patch;
  put = this.rest.put;
  delete = this.rest.delete;
}
