# Building Yelp!

## Goal

Build a clone of popular restaurant reviews website Yelp, using your knowledge of MongoDB queries, processing, and performance. 


## Table of Contents


- [ 0 ] Authentication 🔐
- [ 1 ] Connecting Users 🙇
- [ 2 ] Creating and Viewing Restaurants 🍔
- [ 3 ] Reviewing Restaurants ⭐

## Step 0: Authentication 🔐 - `app.js`, `routes/index.js`,  `models/models.js`
Before you start this project, check out the codebase, beginning in **`app.js`** - the entry point of your application. 

Notice how your authentication method has been set to use a `LocalStrategy` with Passport to identify users by an email address and check their password (which is stored as a hash in your MongoDB database). Remember: your currently logged-in users are accessible through your Passport-created req.user object. Take advantage of that in the Parts that follow!

Next, head into **`routes/index.js`**.

You should notice that the Login, Logout and Registration routes have been provided for you. Begin by adding authentication details for your MongoDB database (either with the environment variable `MONGODB_URI` or with the file `connect.js`) on mLab and creating an account. 

> ⚠️ **Warning**: You will be changing the schema for a user significantly in the next Part (Connecting Users). Remember to dump your existing users from this Part before testing your website in the next.


That’s it! There’s nothing to code in this part - just getting familiar with your code.
Get ready to dive in and create more models and properties to build out the rest of Yelp!

## Step 1: Connecting Users 🙇
Now we’ll be adding more properties to our users in our database model to

Models
Followers (array of User _id’s)
Helpers (methods/statics/virtuals)
Static: .populate() a user’s Followers with User models
Method: Follow


Views
Display a user’s profile page with a list of their followers (profile.hbs)


Routes (not provided, but most likely will look like:)
GET /profile/:id
POST /profile/follow/:id

Step 2: Creating and Viewing Restaurants 🍔


Foreign Keys vs. Embedding
.populate()
Joins
Batch updates
Find + update vs findAndModify
Basic Query things:
Counts (yes)
Filters 
JSON-like queries
Paging (yes) 

user.Getfollowers
user.Follow
user.Unfollow 
user.verifyPassword (virtual field)

Give methods and field for each model.
All the fields and their types

Leave to them to write their own validation 

Describe views with mockups but not routes


Step 3: Reviewing Restaurants ⭐

