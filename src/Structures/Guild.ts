import type { APIWrapper } from "../API";
// import { CacheManager } from "../Cache";
import type { APIGuild } from "../Types";

type APIPartialGuild = Partial<APIGuild> & Required<Pick<APIGuild, "id">>;

export class Guild {
  id: string;

  // members = new CacheManager(async (id) => {
  //   const req = await this.api.get(`/guilds/${this.id}/members/${id}`);
  //   const roles = req.data.roles.map((d: APIRole) => new Role(d));
  //   return new Member(this.api, this, req.data, new User(req.data.user), roles);
  // });
  // member = this.api.hasToken ? this.members.fetch : this.members.get;

  constructor(readonly api: APIWrapper, d: APIPartialGuild) {
    this.id = d.id;
  }
}
