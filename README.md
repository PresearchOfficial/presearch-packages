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

*Please do not perform development from a fork, simply clone it instead*

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

## Package Evaluation Guide

Review Step:

Open up the pull request for the package and take a look a the file changes under the `Files changed` tab

You're going to need to look over these files for any malicious code

- Look for proper indentation
- Check for readability
  - Are variable names expressive? 
  - Is it indented properly? 
  - Did the author use proper syntax?
- Check all http requests to outer api's and make sure only the data used is being returned and nothing else
- Check any scripts being inserted for suspicious activity
- Check the code for quality
  - Is it concise? 
  - Is it effective code? 
  - Are there any uneccesary steps being taken? 
  - Is there repetition that could be minimized? 
  - Is it built to allow easy future maintenance?
- Check that there are no api keys or other sensitive data exposed
- Lastly, just make sure you understand each line and what it does
   
Testing Step:

- Switch to the appropriate branch and update your local repo (git pull)
- Navigate to `http://localhost:4000/?query=<sampleQuery>&packageKey=<packageKey>` and insert the appropriate query and packageKey parameters
- Make sure everything loads and works as expected
  - If something behaves differently than described by the creator then take note of that
- Check the console in your browsers developers menu for errors or warnings

Feedback Step:

If at any stage in this process you found an error or something was off or you have a question for the author, leave explicit, detailed comments on the pull request for the author to go through and fix.


