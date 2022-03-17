<pre><h1 align="center">httpcord</h1></pre>

[Support server](https://discord.gg/4ew5Gx7m7z)

Framework to build Discord HTTP interaction servers. Forget the gateway, forget
scaling problems, just throw it in a docker container and put it on Cloud Run :)

## Example (for Node.JS and Express)

```ts
import Express from "express";
import { ExpressServer } from "httpcord";

const publicKey = process.env["PUBLIC_KEY"] || process.exit(1);
const app = Express();
const interaction = new ExpressServer({ publicKey, app });

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

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening on port ${process.env.PORT || 5000}`);
});
```

## Project status

- [ ] Full 'no-bot' functionality
  - [x] Start and listen a server
  - [ ] Ability to register and handle all interaction types
  - [ ] Permissions (although may hold off on that due to perm v2 coming?)
  - [x] Slash commands
  - [ ] Context commands
  - [x] Components
  - [ ] Modals
  - [ ] Respond to all interaction types
  - [x] Options like pylon?
  - [ ] APIManager Rate limit handling
  - [ ] APIManager Error handling
- [ ] Extra bot token functionality
  - [x] Supply bot token in config
  - [x] Store application command data (name, description) within code and register on startup
  - [x] Custom classes for users, interactions, etc...
  - [ ] Actions on classes e.g. member.kick, user.message, channel.send...
  - [ ] Cache like discordjs?
