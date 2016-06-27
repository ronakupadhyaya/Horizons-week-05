# Inline Exercise: Convert

## Goal

The goal of this exercise is to create models with one-to-one and
one-to-many relationships using embedded MongoDb arrays and objects.

## Time limit: 15 minutes

## Instructions

Let's take the JSON menu we built in the warmup exercise and load that into
MongoDb.

1. Copy your `menu.json` from the Warmup exercise into this folder.
1. Copy your `connect.js` from last week into this folder.
1. Edit `week05/day1/restmodel/app.js` where it says `YOUR MODEL HERE`
1. Edit the `Restaurant` model to add fields from `menu.json` to your model.
  The names of these fields should match the names in `menu.json`.
  <br>
  Fields to add:

   - Restaurant name
   - Menu
    - Menu item
      - Item name
      - Item price
      - Ingredients array

1. Run your app with `npm start`.
1. Open up [http://localhost:3000/](http://localhost:3000/) check that it's
   empty.
1. Open up [http://localhost:3000/create](http://localhost:3000/create)
   to load the contents of `model.json` into MongoDb.
1. Open up [http://localhost:3000/](http://localhost:3000/) check that it
  contains the right information.
