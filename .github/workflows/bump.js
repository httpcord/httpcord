const fs = require("fs/promises");
const cp = require("child_process");

if (process.argv.length < 3) throw new Error("no commit sha");

const commitSha = process.argv[2].slice(0, 7);
const path = `${process.cwd()}/package.json`;

fs.readFile(path).then(async (f) => {
  let package = JSON.parse(f);
  package.version = `${package.version}-${commitSha}`;
  package = JSON.stringify(package);

  // Prettify
  await fs.writeFile(path, package);
  const pretty = cp.execSync("npx prettier package.json");
  await fs.writeFile(path, pretty); // there must be a better way to do this
});
