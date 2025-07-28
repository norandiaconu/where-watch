var fs = require("fs");

fs.readFile("./docs/browser/index.html", "utf8", (err, htmlString) => {
    const replaced = htmlString
        .replace(/"main\./, '"main-obfuscated.')
        .replace(/"polyfills\./, '"polyfills-obfuscated.')
        .replace(/"runtime\./, '"runtime-obfuscated.');
    fs.writeFileSync("./docs/browser/index.html", replaced);
    fs.readdirSync("./docs/browser")
        .filter((f) => /main\..*\.js|polyfills\..*\.js|runtime\..*\.js/.test(f))
        .map((f) => fs.unlinkSync("./docs/browser/" + f));
    console.log("Completed replacing files in /docs/browser");
});
