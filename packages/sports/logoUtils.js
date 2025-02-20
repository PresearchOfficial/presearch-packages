const Path = require('path');
const fs = require('fs');
var axios = require('axios');

const teams = require('./teams.json');
const leagues = require('./leagues.json');
const logosPath = 'logos';

async function downloadImage(url, fileName) {
    const path = Path.resolve(__dirname, logosPath, fileName);
    const writer = fs.createWriteStream(path);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

function getLogo(team) {
    const foundLocalTeam = teams.find(t => t.id === team.id);
    if (foundLocalTeam) {
        return base64(__dirname + '/' + foundLocalTeam.logo);
    }
    return '';
}

async function downloadNewLogo(obj, type) {
    const logoName = type + "_" + obj.id + ".png";
    Promise.resolve(await downloadImage(obj.logo, logoName));
    return logosPath + '/' + logoName;

}

// function to encode file data to base64 encoded string
function base64(file) {
    if (fs.existsSync(file)) {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer.from(bitmap).toString('base64');
    }
    return '';
}

module.exports = { downloadImage, getLogo, base64, downloadNewLogo }