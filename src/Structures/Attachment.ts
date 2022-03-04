import { APIAttachment } from "../Types/";

export class Attachment {
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

  constructor(d: APIAttachment) {
    this.id = d.id;
    this.name = d.filename;
    this.description = d.description;
    this.type = d.content_type as `${string}/${string}`;
    this.size = d.size;
    this.url = d.url;
    this.proxyURL = d.proxy_url;

    this.height = d.height || undefined;
    this.width = d.width || undefined;
    this.ephemeral = !!d.ephemeral;
  }
}
