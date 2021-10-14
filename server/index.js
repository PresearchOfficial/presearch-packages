"use strict";
require("dotenv").config();

const fs = require("fs");
const express = require("express");
const packageObject = require(`${__dirname}/../index`);
const app = express();
const PORT = 4000;

app.set("view engine", "pug");
app.set("title", "Presearch");
app.set("PRESEARCH_DOMAIN", "/");
app.use(express.static("public"));

// share current path and query with views
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

const addRoutesInterval = setInterval(() => {
    if (packageObject && Object.keys(packageObject).length) {
        clearInterval(addRoutesInterval);
        Object.keys(packageObject).forEach((packageName) => {
            let packageInfo = fs.readFileSync(`../packages/${packageName}/package.json`);
            const { version, author } = JSON.parse(packageInfo);
            app.get(`/${packageName}`, async (req, res) => {
                const query = req.query.q ? req.query.q : "";
                const trigger = await packageObject[packageName].trigger(query);
                if (trigger) {
                    const packageData = await packageObject[packageName][packageName](query, process.env[`API.${packageName.toUpperCase()}`]);
                    return res.render("search", { title: packageName, packageData, triggered: true, query, packageInfo: JSON.stringify({ version, author }) });
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
