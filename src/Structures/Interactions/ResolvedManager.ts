import { Attachment, Channel, Member, Message, Role, User } from "..";
import type { APIWrapper } from "../../API";
import { APIInteractionDataResolved } from "../../Types";

export class ResolvedManager {
  readonly users = new Map<string, User>();
  readonly members = new Map<string, Member>();
  readonly roles = new Map<string, Role>();
  readonly channels = new Map<string, Channel>();
  readonly messages = new Map<string, Message>();
  readonly attachments = new Map<string, Attachment>();

  constructor(api: APIWrapper, data: APIInteractionDataResolved) {
    if ("users" in data && data.users)
      for (const [k, v] of Object.entries(data.users)) {
        this.users.set(k, new User(v));
      }

    if ("roles" in data && data.roles)
      for (const [k, v] of Object.entries(data.roles)) {
        this.roles.set(k, new Role(v));
      }

    if ("members" in data && data.members)
      for (const [k, v] of Object.entries(data.members)) {
        this.members.set(k, new Member(api, v, this.users.get(k)!));
      }

    if ("channels" in data && data.channels)
      for (const [k, v] of Object.entries(data.channels)) {
        this.channels.set(k, new Channel(api, v));
      }

    if ("messages" in data && data.messages)
      for (const [k, v] of Object.entries(data.messages)) {
        this.messages.set(k, new Message(v));
      }

    if ("attachments" in data && data.attachments)
      for (const [k, v] of Object.entries(data.attachments)) {
        this.attachments.set(k, new Attachment(v));
      }
  }

  readonly user = this.users.get;
  readonly member = this.members.get;
  readonly role = this.roles.get;
  readonly channel = this.channels.get;
  readonly message = this.messages.get;
  readonly attachment = this.attachments.get;
}
