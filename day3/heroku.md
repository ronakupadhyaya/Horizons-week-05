# Inline Exercise: Git deploy to Heroku

## Goal

The goal of this exercise is to get comfortable deploying to Heroku with
git.

## Time limit: 15 minutes

## Instructions

For this exercise you will be creating a new Git repository of your own
and deploying it to Heroku.

1. Create a new folder for your new repository
1. Open up the folder in the terminal and initialize Git:

  ```bash
  git init
  ```

1. Create a new `.gitignore` file to keep unnecessary Node files out of
  Git

  ```
  node_modules
  npm-debug.log
  ```

1. Initialize `npm` in your new folder

  ```
  npm init
  ```

1. Commit all your newly created files to Git

  ```bash
  git add . # Add everything in the current directory to git
  git commit -m "First commit" # -m specifies the commit message
  ```

1. Install express to your repository

  ```
  npm install --save express
  ```

1. Create an `app.js` file with a `GET /` route

  ```javascript
  var express = require('express');
  var app = express();

  app.get('/', function(req, res) {
    res.send("I'm running express. This feels familiar");
  });

  app.listen(process.env.PORT || 3000); // process.env.PORT is necessary for Heroku
  ```

1. Run your app with `node app.js` and visit localhost:3000 to verify it's working.
1. Commit your changes again.
1. Set up your npm start script by adding this to `package.json`

  ```json
  "scripts": {
    "start": "node app.js"
  },
  ```

1. Now run your app with `npm start`, verify.
1. Commit your changes for the final time.
1. If you haven't before,
   [install Heroku command line tools](https://devcenter.heroku.com/articles/heroku-command)
1. Create a new Heroku app

  ```
  heroku create
  ```

1. Deploy to Heroku with git push:

  ```
  git push heroku
  ```

1. Visit your app's Heroku page and verify that your page is working.
  Your URL will be YOUR-APP-NAME.herokuapp.com
1. Now you can share your web apps with the world!
