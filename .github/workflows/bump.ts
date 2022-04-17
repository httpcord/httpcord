const run = (...cmd: string[]) => Deno.run({ cmd }).status();
const depMsg = "This old development version is no longer supported.";

run("npm", "version", "prerelease", "--preid=dev", "--no-git-tag-version");
run("npm", "deprecate", `httpcord@0.0.0-dev.x`, depMsg);
