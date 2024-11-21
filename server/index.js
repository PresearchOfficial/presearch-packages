"use strict";
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const packageObject = require(`${__dirname}/../index`);
const app = express();
const PORT = 4000;

// Allow all origins (for development)
app.use(cors());

// Load environment variables
const TEAM_ID = process.env["API.MAP_TEAM_ID"];
const KEY_ID = process.env["API.MAP_KEY_ID"];
const MAPS_ID = process.env["API.MAP_MAPS_ID"];
const PRIVATE_KEY_PATH = process.env["API.MAP_PRIVATE_KEY_PATH"];

// Read your private key
const privateKey = fs.readFileSync(PRIVATE_KEY_PATH);

// Function to generate the JWT token
function generateMapkitToken() {
    const token = jwt.sign({}, privateKey, {
        algorithm: 'ES256',
        keyid: KEY_ID,
        issuer: TEAM_ID,
        expiresIn: '6h',
        subject: MAPS_ID,
    });
    return token;
}

app.set("view engine", "pug");
app.set("title", "Presearch");
app.set("PRESEARCH_DOMAIN", "/");
app.use(express.static("public"));

// Share current path and query with views
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

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
            app.get(`/${packageName}`, async (req, res) => {
                const startTime = Date.now();
                const query = req.query.q ? req.query.q : "";
                const geolocation = req.query.geolocation && req.query.geolocation === "1" ? { city: 'London', coords: { lat: 51.5095, lon: -0.0955 } } : null;
                const trigger = await packageObject[packageName].trigger(query);
                if (trigger) {
                    const overlappingPackages = await checkOverlapingTrigger(query);
                    const packageData = await packageObject[packageName][packageName](
                        query,
                        process.env[`API.${packageName.toUpperCase()}`],
                        geolocation,
                        generateMapkitToken  // Pass the token generation function
                    );
                    const packageError = (packageData && packageData.error) && packageData.error;
                    const totalTime = Date.now() - startTime;
                    return res.render("search", { title: packageName, packageData, packageError, triggered: true, overlappingPackages, query, packageInfo: JSON.stringify({ version, author }), totalTime });
                }
                res.render("search", { title: packageName, triggered: false, query, packageInfo });
            });
        });
    }
}, 200);

app.get("/", async (req, res) => {
    res.render("index", { packageObject });
});

app.listen(PORT, () => console.log(`Server listening on: ${PORT}`));
