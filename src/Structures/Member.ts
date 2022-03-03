import { APIInteractionDataResolvedGuildMember, APIUser } from "../Types";
import { User, Role } from ".";

export class Member {
  user: User;
  nick?: string;
  avatar?: string;
  roles: Role[];

  constructor(data: APIInteractionDataResolvedGuildMember, user: APIUser) {
    this.user = new User(user);
  }
}
