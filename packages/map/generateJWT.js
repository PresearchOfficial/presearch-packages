const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const TEAM_ID = process.env["API.MAP_TEAM_ID"];
const KEY_ID = process.env["API.MAP_KEY_ID"];
const MAPS_ID = process.env["API.MAP_MAPS_ID"];
const privateKey = process.env["API.MAP_PRIVATE_KEY"];

// Function to generate the JWT token
function generateMapkitToken() {
    if (!TEAM_ID || !KEY_ID || !MAPS_ID || !privateKey) {
      console.error("Missing environment variables");
      return;
    }
    const privateKeyFormatted = privateKey.replace(/\\n/g, '\n');

    const now = Math.floor(Date.now() / 1000);
    // Token expires in 180 days
    const expires = now + 3600 * 24 * 180;

    const payload = {
      iss: TEAM_ID,
      iat: now,
      exp: expires,
      sub: MAPS_ID
    };

    const header = {
      alg: 'ES256',
      kid: KEY_ID,
    };

    const token = jwt.sign(payload, privateKeyFormatted, { header });
    return token;
}

module.exports = generateMapkitToken;