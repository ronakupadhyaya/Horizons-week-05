# Building Yelp!

## Goal

Build a clone of the popular restaurant reviews website Yelp, using your knowledge of MongoDB queries, processing, and performance. 


## Table of Contents


- **[ 0 ]** Authentication 🔐
- **[ 1 ]** Connecting Users 🙇
- **[ 2 ]** Creating and Viewing Restaurants 🍔
- **[ 3 ]** Reviewing Restaurants ⭐

## Step 0: Authentication 🔐 - `app.js`, `routes/index.js`,  `models/models.js`
👀 **Note:** this is a read-only Step - _No writing code here!_

Before you start this project, check out the codebase, beginning in **`app.js`** - the entry point of your application. 

Notice how your authentication method has been set to use a `LocalStrategy` with Passport to identify users by an email address and check their password (which is stored as a hash in your MongoDB database). **Remember**: your currently logged-in users are accessible through your Passport-created `req.user` object. Take advantage of that in the Parts that follow!

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



**We want to use the latter**, because Schemas allow us to define useful functions on top of them, using virtuals and methods (more about these below). You will be able to define your properties inside of your Schema just like you normally do. When you create your model, just pass in a Schema as the second parameter, like `mongoose.model("User", userSchema)` as demonstrated above.

Here are some properties you definitely want to include in your Schema; your choice for their actual property names - just be consistent!

- **Display Name** (`String`) - could be a first name, last name, nickname, etc.
- **Email** (`String`) - used for authentication 
- **Password** (`String`) - hashed password used for authentication
- **Location** (`String`) - a _descriptive_ location - this location does not have coordinates! (ex. "Southern California", "Orange County", "Huntington Beach")
- **Reviews** (`Array`) - an array of IDs corresponding to `Review` documents created by the user
- **Friendships** (`Array`) - an array of IDs corresponding to `Friendship` documents associated with the user's relationships/friendships

Next, you want to create a function for each of the `User` models that allows us to take the Reviews array, which is **only a group of IDs referring to objects** and convert that into an array of **actual Review objects.**

We will accomplish this by using Mongoose _methods_. The way we write Mongoose methods is like the following: 

```
var userSchema = new mongoose.Schema({...});
userSchema.methods.yourMethodName = function() {
	/* define your method here! */
};
```

We want to write the following methods on our `User` Schema:

- `getReviews` - This function should go through the array of Review IDs of the current model and return an array of the actual Review documents.
- `getFriends` - This function will go through the array of Friendship IDs of the current model and return an array of User objects corresponding to the User on the other side of the friendship - your current model/User should not be returned as a part of this array! - you cannot be friends with yourself 😢
	- Note: once you get a populated list of your Friendship documents, loop through them to only return the ones that are _not_ you. The return result will look like:
	
	```
	[{
		_id: 575xxxxxxxxxxxxx,
		displayName: "Moose Paksoy",
		email: "moose@joinhorizons.com",
		location: "San Francisco",
		reviews: [Array],
		friendships: [Array]
	},
	{
		_id: 575xxxxxxxxxxxx,
		displayName: "Fast Lane",
		email: "lane@joinhorizons.com",
		location: "New York City",
		reviews: [Array],
		friendships: [Array]
	},
	{
		_id: 575xxxxxxxxxxxx,
		displayName: "Josh",
		email: "josh@joinhorizons.com",
		location: "Rutgers",
		reviews: [Array],
		friendships: [Array]
	}]
	```

Use Mongoose's [`.populate()`](http://mongoosejs.com/docs/api.html#model_Model.populate) to populate your user and return the array of your user's Review or User (friend) objects. You will have to do a little more for `getFriends`, since a Friendship document is not what you want back - you want an array of Users back.

You do not have to populate the `reviews` and `friendships` fields of the User documents, but you may find it helpful to list the number of friends and reviews that a person has when displaying them on your friends list!


**Tip**: you can refer to the current model that is calling a method using the `this` keyword - a lot like an object and its function prototypes! Keep in mind that to call `.populate`, you will have to run:

`this.model("User OR YOUR MODEL NAME").populate(this, {opts...}, function(err, user) {...})`



### Friendships! 👫 - `models/models.js`

Friendships are awesome, but they are also a little complicated. We _could_ choose to add to an array of usernames representing friends to _each_ User, but that would mean we would have to update two users every time a friendship was created. Instead, we'll keep track of each User's relationship with another model - the `Friendship`.

Here are the properties you'll want to define for each of your Friendships:

- **User ID 1** (`mongoose.Schema.Types.objectId`) (for this part, order does not matter) - the ID of one of the users party to the friendship
- **User ID 2** (`mongoose.Schema.Types.objectId`) - the ID of the other user party to the friendship

No methods or virtuals necessary for this model!


### End Result, Step 1🏅- `http://localhost:3000`
How do we test this, you ask?

At the end of Step 1, you should be able to login, view profile pages (and edit user details), view other profiles, and request and verify friendships. 

Hooray! You've just built the fundamentals of a social network! Now it's time to take those users and associate more data with them in the form of restaurants and their reviews.


## Step 2: Creating and Viewing Restaurants 🍔
###Restaurant Models 🍚 - `models/models.js`

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

