import { MessageComponentInteraction } from "../Structures";
import {
  ComponentAcknowledgementType,
  MessageComponentInteractionResponse,
} from "../Types";

export type MessageComponentConfig<T extends readonly string[]> = {
  name: string;
  opts?: T;
  ackBehavior?: ComponentAcknowledgementType;
};

export type ResolvedOptions<T extends readonly string[]> = {
  [key in T[number]]: string;
};

function encode(data: string): string;
function encode(data: string[]): string[];
function encode(data: string | string[]) {
  if (Array.isArray(data)) return data.map(encodeURIComponent);
  else return encodeURIComponent(data);
}

function decode(data: string): string;
function decode(data: string[]): string[];
function decode(data: string | string[]) {
  if (Array.isArray(data)) return data.map(decodeURIComponent);
  else return decodeURIComponent(data);
}

type Callback<T extends readonly string[]> = (
  i: MessageComponentInteraction,
  o: ResolvedOptions<T>
) => unknown;

export class ComponentManager {
  private registered = new Map<
    string,
    MessageComponentConfig<readonly string[]> & {
      fn: Callback<readonly string[]>;
    }
  >();

  register<T extends readonly string[]>(
    config: MessageComponentConfig<T>,
    fn: Callback<T>
  ) {
    this.registered.set(encode(config.name), { ...config, fn });
  }

  async execute(
    i: MessageComponentInteraction
  ): Promise<MessageComponentInteractionResponse> {
    const params = decode(i.customId.split("::"));
    const name = params[0];
    const values = params.slice(1);

    const data = this.registered.get(name);
    const options: ResolvedOptions<string[]> = {};

    if (values.length !== (data?.opts || []).length)
      return {
        type: 4,
        data: {
          content: "httpcord: mismatch between registered and given params",
        },
      };

    data?.opts?.forEach((o, i) => Object.defineProperty(options, o, values[i]));

    if (data) {
      const e = data.ackBehavior === ComponentAcknowledgementType.AutoEphemeral;
      const edit = data.ackBehavior === ComponentAcknowledgementType.Edit;

      /* eslint-disable no-fallthrough */
      switch (data.ackBehavior) {
        default:
          data.fn(i, options); // Run in background
          setTimeout(() => i.defer(e, edit), 1500); // Defer if no reply in 1500ms
        case ComponentAcknowledgementType.Manual:
          return await i.awaitResponse();
      }
    }

    return { type: 4, data: { content: "httpcord: unknown component" } };
  }

  /**
   * Transforms a component name to a string that will resolve to it upon being
   * executed. The params provided will be passed to the message component.
   *
   * It is advised to use this function instead of generating component IDs
   * yourself, as this method will automatically encode params for you.
   */
  get(name: string, ...params: string[]) {
    return encode([...name, ...params]).join("::");
  }
}
