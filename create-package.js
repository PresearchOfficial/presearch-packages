const { exec, spawn } = require("child_process");
const fs = require("fs");
const colors = require("colors");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const isWindows = process.platform === "win32";

const packageName = process.argv[2];
if (!packageName) {
    console.log("Error: Please enter package name".red, "\nnpm run create-package {package-name}\n".yellow);
    return process.exit(1);
}
try {
    let packageDir = fs.readdirSync(`./packages/${packageName}`);
    if (packageDir) {
        console.log(`Error: Package ${packageName} already exist.\n`.red);
        return process.exit(1);
    }
} catch (err) {}

function execCallback(error) {
    if (error) {
        console.log(`\nError: package has not been created... ${error}`.red);
        return process.exit(1);
    }
    const cmd = isWindows ? "cmd" : "npm";
    const args = isWindows ? ["/c", "npm init -y &>/dev/null"] : ["init -y &>/dev/null"];

    const npmInitComman = spawn(cmd, args, {
        shell: true,
        stdio: "inherit",
        cwd: `${__dirname}/packages/${packageName}`,
    });
    npmInitComman.on("close", () => {
        let userName;
        rl.question("Enter your name: ".cyan, (name) => {
            userName = name;
            rl.close();
        });

        rl.on("close", function () {
            console.log("yo" + userName);
            let packageInfo = fs.readFileSync(`./packages/${packageName}/package.json`);
            packageInfo = JSON.parse(packageInfo);
            packageInfo.author = userName;
            packageInfo.license = "MIT";
            packageInfo = JSON.stringify(packageInfo);
            packageInfo = packageInfo.split(",").join(",\n ").split("{").join("{\n ").split("}").join("\n}");
            fs.writeFileSync(`./packages/${packageName}/package.json`, packageInfo);
            console.log(`\nSuccess! ${packageName} package has been created!\n`.green);
            console.log(`You can now open`.cyan + ` presearch-packages/packages/${packageName} `.yellow + `directory in your fav code editor.\n`.cyan);
            console.log(
                `If you want to test your package, run a test server `.cyan +
                    ` cd server && npm run start `.yellow +
                    `and open`.cyan +
                    ` http://localhost:4000/${packageName} `.yellow +
                    `in your web browser.\n`.cyan
            );
            process.exit(0);
        });
    });
}

if (isWindows) exec(`npm run create-package-windows ${packageName}`, execCallback);
else exec(`npm run create-package-linux ${packageName}`, execCallback);
