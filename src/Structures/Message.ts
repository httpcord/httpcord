import { User } from ".";
import { APIMessage, MessageType } from "../Types";

export class Message {
  id: string;
  content: string;
  type: MessageType;
  author: User;

  constructor(d: APIMessage) {
    this.id = d.id;
    this.content = d.content;
    this.type = d.type;
    this.author = new User(d.author);
  }
}
