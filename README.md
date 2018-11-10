# Presearch Packages

*Open source instant information packages for the Presearch engine*

## Video Walkthrough

[![Presearch Packages Open Source Contribution Process](https://img.youtube.com/vi/xLNFI12Vdas/0.jpg)](https://www.youtube.com/watch?v=xLNFI12Vdas)

## Install

In order to install and use presearch-packages you need to have Node.js and NPM installed locally. [Node.js install](https://nodejs.org/en/download/)

```
$ git clone https://github.com/PresearchOfficial/presearch-packages
$ cd presearch-packages && npm install
```

*Please do not fork the repo, simply clone it instead.*

## Development

```
$ cd server && npm install && npm start
```

Packages available at: `http://localhost:4000/?query=<sampleQuery>&packageKey=<packageKey>`

Change the query and packageKey parameters accordingly

Place API keys in a `.env` file at the root of the project for development:
```
MY_API_KEY=fooandotherstuff
```

Include API keys from `.env`:
```
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: `${__dirname}/../../.env`});
}
```

Access API keys from package:
```
const API_KEY = process.env.MY_API_KEY;
```

The `.env` file is included in the .gitignore

*Do not push your API keys to the presearch-packages repository*

## Contributing

Developing a new package for the Presearch engine:

- Install `presearch-packages` if you have not already done so
- Create a new branch `<username>/<packageKey>`
- Switch to your new branch
- Run `npm run create-package <packageName>`
- Develop and test package using local development server
- Create a pull request with the packageKey
- If API key(s) are required email them to dev@presearch.io with the pull request number in the subject and the key in the body
- Your pull request will be merged in if the package is correct and relevant
- Email dev@presearch.io with any questions other questions
