import { Permissions } from ".";
import type { APIWrapper } from "../API";
import {
  APIInteractionDataResolvedChannel,
  APIThreadMetadata,
  ChannelType
} from "../Types";

export class Channel {
  id: string;
  name?: string;
  type: ChannelType;

  parentId?: string;
  thread?: APIThreadMetadata;
  permissions: Permissions;

  constructor(readonly api: APIWrapper, d: APIInteractionDataResolvedChannel) {
    this.id = d.id;
    this.name = d.name;
    this.type = d.type;

    this.parentId = d.parent_id || undefined;
    this.thread = d.thread_metadata || undefined;
    this.permissions = new Permissions(BigInt(d.permissions));
  }
}
