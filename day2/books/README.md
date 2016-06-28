# Inline exercise: Pagination with books

## Goal

The goal of this exercise is to get comfortable using `.sort()`,
`.limit()` and `.skip()`

## Time limit: 15 minutes

## Instructions

1. Install dependencies `npm install`
1. Copy out `connect.js` into `week05/day2/books`
1. Start your app with `npm start`
1. Import books into your table using [http://localhost:3000/import/books](http://localhost:3000/import/books)
1. Open `app.js` and `index.hbs`
1. Sort books by title in `GET /`
1. Only display 20 books at a time in `GET /`
1. Create a query parameter `page` in `GET /` that lets you page through books.
   Use `.skip()` to jump through books.
1. Update the buttons in `index.hbs` to point to the next and previous page.
