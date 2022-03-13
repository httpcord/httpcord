import { APIVersion, Route } from "./Types";
import axios, {
  AxiosRequestConfig as Config,
  AxiosRequestHeaders,
  AxiosInstance,
} from "axios";

type Data = Record<string, any>;

export default class APIManager {
  private version = APIVersion;
  private baseURL = `https://discord.com/api/v${this.version}`;
  private session: AxiosInstance;

  constructor(token?: string) {
    const headers: AxiosRequestHeaders = { "User-Agent": "httpcord/1.0" };
    if (token) headers["Authorization"] = `Bot ${token}`;
    this.session = axios.create({ baseURL: this.baseURL, headers });
  }

  get = async (r: Route, c?: Config) => this.session.get(r, c);
  post = async (r: Route, d?: Data, c?: Config) => this.session.post(r, d, c);
  patch = async (r: Route, d?: Data, c?: Config) => this.session.patch(r, d, c);
  put = async (r: Route, d?: Data, c?: Config) => this.session.put(r, d, c);
  delete = async (r: Route, c?: Config) => this.session.delete(r, c);
  options = async (r: Route, c?: Config) => this.session.options(r, c);
}
