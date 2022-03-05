const fs = require("fs/promises");
const cp = require("child_process");

if (process.argv.length < 3) throw new Error("no commit sha");

const commitSha = process.argv[2].slice(0, 7);
const path = `${process.cwd()}/package.json`;

fs.readFile(path).then(async (f) => {
  let package = JSON.parse(f);
  const version = `${package.version}-${commitSha}`;
  cp.execSync(`npm version --no-git-tag-version ${version}`);
});
