<pre><h1 align="center">httpcord</h1></pre>

[Support server](https://discord.gg/4ew5Gx7m7z)

Framework to build Discord HTTP interaction servers. Forget the gateway, forget
scaling problems, just throw it in a docker container and put it on Cloud Run :)

## Example (for Node.JS and Express)

```ts
import Express from "express";
import { ExpressServer } from "httpcord";

const publicKey = "N0t_a_Pub1iC_K3y_r3plAce_ME";
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

- [ ] Documentation
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
  - [x] APIManager Rate limit handling
  - [x] APIManager Error handling
- [ ] Extra bot token functionality
  - [x] Supply bot token in config
  - [x] Store application command data (name, description) within code and register on startup
  - [x] Custom classes for users, interactions, etc...
  - [ ] Actions on classes e.g. member.kick, user.message, channel.send...
  - [ ] Cache like discordjs?

## Contibuting

I try to keep tooling to a minimum. None of that Husky crap or annoying or
broken forced editor settings, only what is strictly necessary and helpful.
Linting and testing is done on the CI side, but you can do it yourself with
`yarn lint` and `yarn test` respectively, but you don't have to if you know what
you're doing. Linting is done in such a way that errors and warnings will be
shown inline when you make your pull request.

1. Make sure you have the latest NodeJS & npm installed.
2. If you're using an editor other than VSCode (like Nova), make sure you have
   the TypeScript extension for that editor installed or that it supports it out
   of the box.
3. run `corepack enable` (if corepack is not found, `npm i -g corepack`)
4. `git clone https://github.com/andre4ik3/httpcord`
5. `yarn` (it'll be installed because of corepack)
6. That's it! Start looking around and making changes.
7. If you want to actually commit, make a fork on GitHub.
8. `git remote set-url origin <YOUR FORK URL>`
9. `git commit -am "Changed something"` then `git push`
10. Go back to your fork on GitHub and hit that pull request button!
