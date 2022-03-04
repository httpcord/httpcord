import {
  APIInteractionDataResolvedGuildMember,
  APIUser,
  APIRole,
} from "../Types";
import { User, Role } from ".";

export class Member {
  user: User;
  nick?: string;
  avatar?: string;
  roles: Role[] | string[] = [];

  constructor(
    data: APIInteractionDataResolvedGuildMember,
    user: User,
    roles?: Role[]
  ) {
    this.user = user;
    this.roles = roles || data.roles;
  }
}
