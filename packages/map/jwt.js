const generateJwt = require("./generateJwt");

const args = process.argv.slice(2);
const [seconds] = args;

console.log("JWT:", generateJwt(seconds ? parseInt(seconds, 10) : undefined));