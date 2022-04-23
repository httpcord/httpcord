import type { APIAttachment, Snowflake } from "../Types";
import type { ServerLike } from "./Base";
import { Structure } from "./Base";

/** Represents an attachment object from Discord. */
export class Attachment extends Structure {
  /** The ID of the attachment. */
  public readonly id: Snowflake;
  /** The file name of the attachment. */
  public readonly name: string;
  /** The caption of the attachment, used by screen readers. */
  public readonly description?: string;
  /** The mime type of the attachment. */
  public readonly type?: `${string}/${string}`;
  /** The size of the attachment in bytes. */
  public readonly size: number;
  /** The source URL of the attachment. */
  public readonly url: string;
  /** A proxied URL of the attachment. */
  public readonly proxyURL: string;

  /** If the attachment is an image, the height of the image. */
  public readonly height?: number;
  /** If the attachment is an image, the width of the image. */
  public readonly width?: number;
  /** If true, the attachment will be deleted from Discord's servers soon. */
  public readonly ephemeral: boolean = false;

  constructor(server: ServerLike, data: APIAttachment) {
    super(server);

    this.id = data.id as Snowflake;
    this.name = data.filename;
    this.description = data.description;
    this.type = data.content_type as `${string}/${string}`;
    this.size = data.size;
    this.url = data.url;
    this.proxyURL = data.proxy_url;

    this.height = data.height ?? undefined;
    this.width = data.width ?? undefined;
    this.ephemeral = data.ephemeral ?? false;
  }
}
