import { APIVersion, Route } from "./Types";
import axios, { AxiosRequestConfig as Config } from "axios";

export default class APIManager {
  private version = APIVersion;
  private session = axios.create({
    baseURL: `https://discord.com/api/v${this.version}`,
    headers: { "User-Agent": "httpcord/1.0" },
  });

  get = async (r: Route, c?: Config) => this.session.get(r, c);
  post = async (r: Route, d?: any, c?: Config) => this.session.post(r, d, c);
  patch = async (r: Route, d?: any, c?: Config) => this.session.patch(r, d, c);
  put = async (r: Route, d?: any, c?: Config) => this.session.put(r, d, c);
  delete = async (r: Route, c?: Config) => this.session.delete(r, c);
  options = async (r: Route, c?: Config) => this.session.options(r, c);
}

export { Routes } from "./Types";
