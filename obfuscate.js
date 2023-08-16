var fs = require("fs");

fs.readFile("./docs/index.html", "utf8", (err, htmlString) => {
  const replaced = htmlString
    .replace(/"main\./, "\"main-obfuscated.")
    .replace(/"polyfills\./, "\"polyfills-obfuscated.")
    .replace(/"runtime\./, "\"runtime-obfuscated.");
  fs.writeFileSync("./docs/index.html", replaced);
  fs.readdirSync("./docs")
    .filter(f => /main\..*\.js|polyfills\..*\.js|runtime\..*\.js/.test(f))
    .map(f => fs.unlinkSync("./docs/" + f));
  console.log("Completed replacing files in /docs");
});
