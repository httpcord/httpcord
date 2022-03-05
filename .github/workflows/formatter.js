// Takes ESLint output and makes it GitHub-friendly
// i.e. errors & warnings show up in GUIs

const { relative } = require("path");
const cwd = process.cwd();

module.exports = function (results) {
  results.forEach((result) => {
    if (!("messages" in result)) return;

    const filePath = `file=${relative(cwd, result.filePath)}`;

    result.messages.forEach((m) => {
      const severity = m.severity === 2 ? "error" : "warning";
      const params = [];

      if ("line" in m) params.push(`line=${m.line}`);
      if ("column" in m) params.push(`col=${m.column}`);
      params.push(filePath);

      console.log(`::${severity} ${params.join(",")}::${m.message}`);
    });
  });
};
