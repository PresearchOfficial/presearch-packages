const { exec, spawn } = require("child_process");
const fs = require("fs");
const colors = require("colors");

const isWindows = process.platform === "win32";

const packageName = process.argv[2];
if (!packageName) return console.log("Error: Please enter package name".red, "\nnpm run create-package {package-name}\n".yellow);
try {
    let packageDir = fs.readdirSync(`./packages/${packageName}`);
    if (packageDir) return console.log(`Error: Package ${packageName} already exist.\n`.red)
} catch(err) {

}


function execCallback(error) {
    if (error) {
        console.log(`\nError: package has not been created... ${error}`.red);
        return process.exit(1);
    }
    const cmd = isWindows ? "cmd" : "npm";
    const args = isWindows ? ["/c", "npm init"] : ["init"];

    const npmInitComman = spawn(cmd, args, {
        shell: true,
        stdio: "inherit",
        cwd: `${__dirname}/packages/${packageName}`,
    });
    npmInitComman.on('close', () => {
        console.log(`\nSuccess! ${packageName} package has been created!\n`.green);
        console.log(`You can now open`.cyan + ` presearch-packages/packages/${packageName} `.yellow + `directory in your fav code editor.\n`.cyan);
        console.log(`If you want to test your package, open`.cyan + ` http://localhost:4000/${packageName} `.yellow + `in your web browser.\n`.cyan);
    })
}

if (isWindows) exec(`npm run create-package-windows ${packageName}`, execCallback);
else exec(`npm run create-package-linux ${packageName}`, execCallback);
