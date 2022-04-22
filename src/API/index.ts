import { REST } from "@httpcord/rest";

/**
 * Wraps the REST class for the rest of the library, only exposing request
 * methods and a check to see if it has a token or not.
 */
export class APIWrapper {
  /** True if the API wrapper has a token associated with it. */
  public readonly hasToken: boolean = false;
  private rest = new REST();

  public constructor(token?: string) {
    this.rest.setToken(token);
    this.hasToken = !!token;
  }

  // Shorthands
  public readonly get = this.rest.get;
  public readonly post = this.rest.post;
  public readonly patch = this.rest.patch;
  public readonly put = this.rest.put;
  public readonly delete = this.rest.delete;
}
