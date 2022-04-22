import type { APIAttachment } from "../Types";
import type { ServerLike } from "./Base";
import { Structure } from "./Base";

export class Attachment extends Structure {
  id: string;
  name: string;
  description?: string;
  type?: `${string}/${string}`;
  size: number;
  url: string;
  proxyURL: string;

  height?: number;
  width?: number;
  ephemeral = false;

  constructor(server: ServerLike, data: APIAttachment) {
    super(server);

    this.id = data.id;
    this.name = data.filename;
    this.description = data.description;
    this.type = data.content_type as `${string}/${string}`;
    this.size = data.size;
    this.url = data.url;
    this.proxyURL = data.proxy_url;

    this.height = data.height ?? undefined;
    this.width = data.width ?? undefined;
    this.ephemeral = !!data.ephemeral;
  }
}
