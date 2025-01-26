"use strict";
require("dotenv").config();

const fs = require("fs");
const express = require("express");
const jwt = require("jsonwebtoken");
const packageObject = require(`${__dirname}/../index`);
const app = express();
const PORT = 4000;

// Allow all origins (for development)
const cors = require('cors');
app.use(cors());

app.set("view engine", "pug");
app.set("title", "Presearch");
app.set("PRESEARCH_DOMAIN", "/");
app.use(express.static("public"));

// Share current path and query with views
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

const TEAM_ID = process.env["API.MAP_TEAM_ID"];
const KEY_ID = process.env["API.MAP_KEY_ID"];
const MAPS_ID = process.env["API.MAP_MAPS_ID"];
const privateKeyPath = process.env["API.MAP_PRIVATE_KEY_PATH"];
let KEY_PRIVATE;
try {
  KEY_PRIVATE = fs.readFileSync(privateKeyPath, 'utf8');
} catch (err) {
  console.error("Error reading private key file:", err);
  process.exit(1); // Exit the process if the private key file cannot be read
}

// Function to generate the JWT token
function generateMapkitToken() {
    const now = Math.floor(Date.now() / 1000);
    const expires = now + 3600; // Token valid for 1 hour
  
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
  
    const token = jwt.sign(payload, KEY_PRIVATE, { header });
    return token;
  }

const checkOverlapingTrigger = async (query) => {
    return new Promise(async (resolve, reject) => {
        const packages = Object.keys(packageObject);
        const triggeredPackages = [];
        for (const packageName of packages) {
            const trigger = await packageObject[packageName].trigger(query);
            if (trigger) {
                triggeredPackages.push(packageName);
            }
        }
        if (triggeredPackages.length > 1) {
            return resolve(triggeredPackages);
        }
        resolve(false);
    });
};

const addRoutesTimeout = setTimeout(() => {
    if (packageObject && Object.keys(packageObject).length) {
        clearTimeout(addRoutesTimeout);
        Object.keys(packageObject).forEach((packageName) => {
            let packageInfo = fs.readFileSync(`../packages/${packageName}/package.json`);
            const { version, author } = JSON.parse(packageInfo);
            // A special route for the map package to generate the token
            if (packageName === 'map') {
                app.get(`/${packageName}`, async (req, res) => {
                    const startTime = Date.now();
                    const query = req.query.q ? req.query.q : "";
                    try {
                        const token = generateMapkitToken();
                        const packageData = await packageObject[packageName][packageName](
                            query,
                            token
                        );
                        const packageError = (packageData && packageData.error) && packageData.error;
                        const totalTime = Date.now() - startTime;
                        return res.render("search", { title: packageName, packageData, packageError, triggered: true, overlappingPackages: [], query, packageInfo: JSON.stringify({ version, author }), totalTime });
                    } catch (error) {
                        console.error(`Error in map package: ${error}`);
                        return res.status(500).render("error", { error: "An error occurred while processing the map package." });
                    }
                });
            } else {
                app.get(`/${packageName}`, async (req, res) => {
                    const startTime = Date.now();
                    const query = req.query.q ? req.query.q : "";
                    const geolocation = req.query.geolocation && req.query.geolocation === "1" ? { city: 'London', coords: { lat: 51.5095, lon: -0.0955 } } : null;
                    const trigger = await packageObject[packageName].trigger(query);
                    if (trigger) {
                        const overlappingPackages = await checkOverlapingTrigger(query);
                        const packageData = await packageObject[packageName][packageName](query, process.env[`API.${packageName.toUpperCase()}`], geolocation);
                        const packageError = (packageData && packageData.error) && packageData.error;
                        const totalTime = Date.now() - startTime;
                        return res.render("search", { title: packageName, packageData, packageError, triggered: true, overlappingPackages, query, packageInfo: JSON.stringify({ version, author }), totalTime });
                    }
                    res.render("search", { title: packageName, triggered: false, query, packageInfo});
                });
            }
        });
    }
}, 200);

app.get("/", async (req, res) => {
    res.render("index", { packageObject });
});

app.listen(PORT, () => console.log(`Server listening on: ${PORT}`));
