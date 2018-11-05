# Presearch Packages

*Open source instant information packages for the Presearch engine*

## Install

In order to install and use presearch-packages you need to have Node.js and NPM installed locally. [Node.js install](https://nodejs.org/en/download/)

```
$ git clone https://github.com/PresearchOfficial/presearch-packages
$ cd presearch-packages && npm install
```

## Development

```
$ cd server && npm start
```

Packages available at: `http://localhost:4000/package?query=apod&packageKey=apod`

Change the query and packageKey parameters accordingly

Place API keys in a `.env` file at the root of the project for development

Include API keys from `.env`:
```
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: `${__dirname}/../../.env`});
}
```

## Contributing

Developing a new package for the Presearch engine:

- Create a new branch `<username>/<packageKey>`
- Install `presearch-packages` if you have not already done so
- Run `npm create-package <packageName>`
- Test package using local development server
- Create a pull request with the packageKey
- If API keys are required email them to dev@presearch.io with the pull request number in the subject
- Your pull request will be merged in if the package is correct and relevant
- Email dev@presearch.io with any questions
