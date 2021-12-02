#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SOURCE = './packages';
const MAIN_PACKAGE = './package.json';

const directories = source => fs.readdirSync(source).filter(child => fs.statSync(path.join(source, child)).isDirectory());
const packages = directories(SOURCE).map(dir => fs.readFileSync(`${SOURCE}/${dir}/package.json`, 'utf-8'));

let dependencies = {};

for (let pack of packages) {
  const packageObj = JSON.parse(pack);
  dependencies = Object.assign({}, packageObj.dependencies, dependencies);
}

const mainPackage = JSON.parse(fs.readFileSync(MAIN_PACKAGE, 'utf-8'));
mainPackage.dependencies = Object.assign({}, mainPackage.dependencies, dependencies);
const newPackageJson = JSON.stringify(mainPackage, null, 4);
fs.writeFileSync(MAIN_PACKAGE, newPackageJson, 'utf-8');
