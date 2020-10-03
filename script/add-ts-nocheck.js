// This scripts add "// @ts-nocheck" at the begin of all .ts file

const fs = require("fs");
const path = require("path");

async function* walk(dir) {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

function addNocheckComment(filePath) {
    let content = fs.readFileSync(filePath, "utf-8")
    let prefix = "// @ts-nocheck\n"
    if (!content.startsWith(prefix)) {
        content = prefix + content
        fs.writeFileSync(filePath, content, {encoding: "utf-8"})
    }
}

async function main() {
    const libDir = path.join(__dirname, "..", "lib")

    for await (const file of walk(libDir)){
        if (file.endsWith(".ts")) {
            console.log(file)
            addNocheckComment(file)
        }
    }
}

main()
