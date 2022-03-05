import { InteractionServer } from ".";

export { InteractionServer } from "./InteractionServer";

const server = new InteractionServer({ publicKey: "test" });

server.slash.register(
  {
    name: "hello",
    description: "gaming",
    options: (opts) => ({
      vim: opts.string("I don't know how to use vim"),
    }),
  },
  async (i, { vim }) => {
    console.log(vim);
    await i.respond("gaming");
  }
);
