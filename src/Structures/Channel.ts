import {
  APIInteractionDataResolvedChannel,
  ChannelType,
  APIThreadMetadata,
} from "../Types";
import { Permissions } from ".";

export class Channel {
  id: string;
  name?: string;
  type: ChannelType;

  parentId?: string;
  thread?: APIThreadMetadata;
  permissions: Permissions;

  constructor(d: APIInteractionDataResolvedChannel) {
    this.id = d.id;
    this.name = d.name;
    this.type = d.type;

    this.parentId = d.parent_id || undefined;
    this.thread = d.thread_metadata || undefined;
    this.permissions = new Permissions(BigInt(d.permissions));
  }
}