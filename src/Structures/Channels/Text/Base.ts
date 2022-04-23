import type {
  APITextBasedChannel,
  Snowflake,
  TextChannelType
} from "../../../Types";
import type { ServerLike } from "../../Base";
import { Channel } from "../Base";
import type { MixChannel } from "../Utils";

/** Represents a text based channel. */
export class TextBasedChannel<T extends TextChannelType> extends Channel<T> {
  /** The ID of the last message that was sent in the channel, if any. */
  public lastMessageId?: Snowflake;
  public type: T;

  public constructor(
    server: ServerLike,
    data: MixChannel<T, APITextBasedChannel<T>>
  ) {
    super(server, data);

    this.type = data.type;
    this.lastMessageId = data.last_message_id ?? undefined;
  }
}
