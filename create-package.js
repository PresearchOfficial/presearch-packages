const { exec, spawn } = require("child_process");
const colors = require("colors");

const isWindows = process.platform === "win32";

const packageName = process.argv[2];
if (!packageName) return console.log("Error: Please enter package name".red, "\nnpm run create-package {package-name}\n".yellow);

function execCallback(error) {
    if (error) {
        console.log(`\nError: package has not been created... ${error}`.red);
        return process.exit(1);
    }
    const cmd = isWindows ? "cmd" : "npm";
    const args = isWindows ? ["/c", "npm init"] : ["init"];

    spawn(cmd, args, {
        shell: true,
        stdio: "inherit",
        cwd: `${__dirname}/packages/${packageName}`,
    });
}

if (isWindows) exec(`npm run create-package-windows ${packageName}`, execCallback);
else exec(`npm run create-package-linux ${packageName}`, execCallback);
