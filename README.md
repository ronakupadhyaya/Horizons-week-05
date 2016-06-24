# Building Yelp!

## Goal

Build a clone of popular restaurant reviews website Yelp, using your knowledge of MongoDB queries, processing, and performance. 


## Table of Contents


- **[ 0 ]** Authentication 🔐
- **[ 1 ]** Connecting Users 🙇
- **[ 2 ]** Creating and Viewing Restaurants 🍔
- **[ 3 ]** Reviewing Restaurants ⭐

## Step 0: Authentication 🔐 - `app.js`, `routes/index.js`,  `models/models.js`
Before you start this project, check out the codebase, beginning in **`app.js`** - the entry point of your application. 

Notice how your authentication method has been set to use a `LocalStrategy` with Passport to identify users by an email address and check their password (which is stored as a hash in your MongoDB database). Remember: your currently logged-in users are accessible through your Passport-created req.user object. Take advantage of that in the Parts that follow!

Next, head into **`routes/index.js`**.

You should notice that the Login, Logout and Registration routes have been provided for you. Begin by adding authentication details for your MongoDB database (either with the environment variable `MONGODB_URI` or with the file `connect.js`) on mLab and creating an account. 

> ⚠️ **Warning**: You will be changing the schema for a user significantly in the next Part (Connecting Users). Remember to dump your existing users from this Part before testing your website in the next.


That’s it! There’s nothing to code in this part - just getting familiar with your code.
Get ready to dive in and create more models and properties to build out the rest of Yelp!

## Step 1: Connecting Users 🙇
Now we’ll be adding more properties to our users in our database model to give them friends and reviews. Notice how we are *not* providing you with the typical scaffolding for each route! 

Your job is to take the specifications for each model and determine, with your views, how many routes you *have*, what they are *called*, and what they *do*. Take a deep breath; you've got this!

### User Models ⛷ - `models/models.js`

Begin by defining a `Schema` - you'll need to do this in order to create `virtuals` and `statics` for later.


> **Tip: you've been creating `Schema`s already!**

> This: 

> ```
module.exports = {
	User: mongoose.model("User", {
		property1: String
	})
}
```
> is equivalent to this:

> ```
> var userSchema = new mongoose.Schema({
> 	property1: String
> })
> 
> module.exports = {
> 	User: mongoose.model("User", userSchema);
> }
> ```



We want to use the latter, because Schemas allow us to define useful functions on top of them, using virtuals and methods. You will be able to define your properties inside of your Schema 



### Friendships! 👫 - `models/models.js`


Views
Display a user’s profile page with a list of their followers (profile.hbs)


Routes (not provided, but most likely will look like:)
GET /profile/:id
POST /profile/follow/:id

## Step 2: Creating and Viewing Restaurants 🍔


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


## Step 3: Reviewing Restaurants ⭐

