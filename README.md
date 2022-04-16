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

Development server will be available at: `http://localhost:4000/`

### API keys

Use `.env` file, inside `presearch-packages/server` directory to store your API keys.
When you will set up your API key correctly, it will be accessible inside your package main function as `API_KEY`.

You can copy example file `.env-example` and change the file name to `.env`

*Do not push your API keys to the presearch-packages repository*

## Contributing

Developing a new package for the Presearch engine:

- Fork `presearch-packages` and clone locally if you have not already done so
- Create an upstream remote and sync your local copy before you branch
- Create a new branch `<username>/<packageName>`
- Always create a new branch for separate packages
- Switch to your new branch
- Run `npm run create-package <packageName>`
- Develop and test package using local development server
- Write good commit messages
- Create a pull request with the packageKey in the title
- To create a pull request you need to push your branch to the origin remote and then click on the create pull request button on Github
- If API key(s) are required email them to dev@presearch.io with the pull request number in the subject and the key in the body
- Your pull request will be merged in if the package is correct and relevant
- Email dev@presearch.io with any questions other questions

[Useful Github Contributing Guide](https://akrabat.com/the-beginners-guide-to-contributing-to-a-github-project/)

## Package Evaluation Guide

Review Step:

Open up the pull request for the package and take a look at the file changes under the `Files changed` tab

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
  - Are there any unnecessary steps being taken?
  - Is there repetition that could be minimized?
  - Is it built to allow easy future maintenance?
- Check that there are no api keys or other sensitive data exposed
- Lastly, just make sure you understand each line and what it does

Testing Step:

- Switch to the appropriate branch and update your local repo (git pull)
- Navigate to `http://localhost:4000/{PACKAGE_NAME}` and insert the appropriate query
- Make sure everything loads and works as expected
  - If something behaves differently than described by the creator then take note of that
- Check the console in your browsers developers menu for errors or warnings

Feedback Step:

If at any stage in this process you found an error or something was off or you have a question for the author, leave explicit, detailed comments on the pull request for the author to go through and fix.


