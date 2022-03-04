<pre><h1 align="center">httpcord</h1></pre>

[Support server](https://discord.gg/4ew5Gx7m7z)

Framework to build Discord HTTP interaction servers. Forget the gateway, forget
scaling problems, just throw it in a docker container and put it on Cloud Run :)

## Example

```ts
import { InteractionServer } from "httpcord";

const publicKey = process.env["PUBLIC_KEY"] || process.exit(1);

const interaction = new InteractionServer({ publicKey });

interaction.slash.register(
  {
    name: "hello",
    options: (opts) => ({
      name: opts.string("your name!"),
    }),
  },
  async (interaction, { name }) => {
    await interaction.respond(`hi ${name}!`);
  }
);

interaction.listen(process.env.PORT || 5000, () => {
  console.log(
    `Interaction server listening on port ${process.env.PORT || 5000}`
  );
});
```

## Project status

- [ ] Full 'no-bot' functionality
  - [x] Start and listen a server
  - [ ] Ability to register and handle all interaction types
  - [ ] Respond to all interacion types
  - [x] Options like pylon?
  - [ ] APIManager Rate limit handling
  - [ ] APIManager Error handling
- [ ] Extra bot token functionality
  - [ ] Supply bot token in config
  - [ ] Store application command data (name, description) within code and register on startup
  - [ ] Custom classes for users, interactions, etc...
  - [ ] Actions on classes e.g. member.kick, user.message, channel.send...
  - [ ] Cache like discordjs?
