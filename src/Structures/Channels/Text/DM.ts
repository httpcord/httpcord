import type { APIDMChannel, ChannelType } from "../../../Types";
import type { ServerLike } from "../../Base";
import type { MixChannel } from "../Utils";
import { TextBasedChannel } from "./Base";

/** Represents a private DM channel. */
export class DMChannel extends TextBasedChannel<ChannelType.DM> {
  constructor(
    server: ServerLike,
    data: MixChannel<ChannelType.DM, APIDMChannel>
  ) {
    super(server, data);
    data.recipients;
  }
}
