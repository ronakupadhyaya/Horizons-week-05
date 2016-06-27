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

Next, head into **`routes/index.js`**. and **`routes/auth.js`**. You should notice that the Login, Logout and Registration routes have been provided for you. These already handle storing users on the database and storing the sessions using passport and mongo-connect.

Begin by adding authentication details for your MongoDB database (either with the environment variable `MONGODB_URI` or with the file `connect.js`) on mLab and creating an account.

> ⚠️ **Warning**: You will be changing the schema for a user significantly in the next Part (Connecting Users). Remember to dump your existing users from this Part before testing your website in the next.


That’s it! There’s nothing to code in this part - just getting familiar with your code.
Get ready to dive in and create more models and properties to build out the rest of Yelp!

## Step 1: Connecting Users 🙇
Now we’ll be adding more properties to our users in our database model to give them friends and reviews. Notice how we are *not* providing you with the typical scaffolding for each route!

Your job is to take the specifications for each model and determine, with your views, how many routes you *have*, what they are *called*, and what they *do*. Take a deep breath; you've got this!

### User Models ⛷ - `models/models.js`

Begin by defining a `Schema` - you'll need to do this in order to create `virtuals` and `statics` for later.


**Tip: you've been creating `Schema`s already!**

This:

```
module.exports = {
	User: mongoose.model("User", {
		property1: String
	})
}
```
is equivalent to this:

```
var userSchema = new mongoose.Schema({
 	property1: String
})

module.exports = {
 	User: mongoose.model("User", userSchema);
}
```



**We want to use the latter**, because Schemas allow us to define useful functions on top of them, using virtuals and methods (more about these below). You will be able to define your properties inside of your Schema just like you normally do. When you create your model, just pass in a Schema as the second parameter, like `mongoose.model("User", userSchema)` as demonstrated above.

Here are some properties you definitely want to include in your **Users Schema**; your choice for their actual property names - just be consistent!

- **Display Name** (`String`) - could be a first name, last name, nickname, etc.
- **username** (`String`) - used for authentication. You have to use username here to authenticate with passport local!.
- **Email** (`String`) - you can ask for email on a separate field as username. Or just ask for an email as a username.
- **Password** (`String`) - hashed password used for authentication

Next, you want to create a function for each of the `User` models that allows us to take the Reviews array, which is **only a group of IDs referring to objects** and convert that into an array of **actual Review objects.**

We will accomplish this by using Mongoose _methods_. The way we write Mongoose methods is like the following:

```
var userSchema = new mongoose.Schema({...});
userSchema.methods.yourMethodName = function() {
	/* define your method here! */
};
```

We want to write the following methods on our `User` Schema:
- `Follow` this one should set a following relationship like the one on twitter. User A -> follows -> B. So this one will be an instance method that acts upon a user. `userSchema.methods.unfollow = function (followId, callback){}`. You pass a followId or id of user B and now the logged in user is following that other user. It must check if you haven't followed that user already. On the database, this is a Schema!
var FollowsSchema = mongoose.Schema({
  uid1 : { type: mongoose.Schema.ObjectId, ref: 'User' },
  uid2 : { type: mongoose.Schema.ObjectId, ref: 'User' },
});
As you can see, uid1 follows uid2.

- `Unfollow` this method deletes the relationship user1 follows user2. So it makes you stop following a user.

- `getFollows` - This function will go through the schema of friendships. The method must be static and work on the users
schema. An example would be: `userSchema.statics.getFollows = function (id, callback){}` This should call the callback method with the followers and users you are following. So `callback(followers, following)`.
In this way you can view the people that are following you and who you follow from your profile. Just like Twitter!
The ones you follow are where the id of the current user is uid1.
The ones who follow you are those records where the current logged user is uid2.
You cannot be friends with yourself 😢, and you cannot follow someone more than one time.

The callback(followers, following) data will look like:
 ```[
	 _id: 575xxxxxxxxxxxx,
	 _id: 575xxxxxxxxxxxx,
	 _id: 575xxxxxxxxxxxx,
 }]
 ```
 For both followers and following the data, after using .populate, your data will look like this:

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

Use Mongoose's [`.populate()`](http://mongoosejs.com/docs/api.html#model_Model.populate) to populate your user and return the array of your user's follower objects.

You need to populate your `followers and followees` to get data like their names. Another option is to get the array of ids and query them to find their names.

**Tip**: you can refer to the current model that is calling a method using the `this` keyword - a lot like an object and its function prototypes! Keep in mind that to call `.populate`, you will have to run:

`this.model("User OR YOUR MODEL NAME").populate(this, {opts...}, function(err, user) {...})`


### Reviews

Reviews are a schema by themselves. A review contains the id of the user leaving the review, the id of the restaurant
receiving the review. So for example Mike -> reviews -> McDonalds. Those must be of id types and not arrays.
You also need to have a content and number of stars you are leaving on the review

- `restaurant.getReviews` - This function should go through the array of Review IDs of the current model and return an array of the actual Review documents for that restaurant. It will be used in the restaurant page.


### Follows! 👫 - `models/models.js`

Follows are awesome, but they are also a little complicated. We _could_ choose to add to an array of usernames representing friends to _each_ User, but that would mean we would have to update two users every time a friendship was created. Instead, we'll keep track of each User's relationship with another model - the `Following`.

Here are the properties you'll want to define for each of your Follows:

- **User ID 1** (`mongoose.Schema.Types.objectId`) (for this part, order does matter) - the ID of the user that follows the other.
- **User ID 2** (`mongoose.Schema.Types.objectId`) - The id of the user being followed

Note that this is the Twitter way of following. One can follow the other without being followed.

> ⚠️  **Warning:** Careful about creating duplicate follows! You should be only creating a new Follows document if it doesn't already exist - make sure you handle this in your routes below.

### Viewing Profiles 👸 - `views/singleProfile.hbs`
Time to put the views together! You'll be first creating the Handlebars template for displaying a user's single profile page. The information you'll need to display here is largely what you've already defined in the models.

This has the user profile data like username, email, display name
The second part is the list of the users you follow.
The third part is the users that follow you.
For this, use getFollows from your model

### Viewing ALL the Profiles 👸👸👸 - `views/profiles.hbs`

This view should display a list of all the users in your Yelp. from there you can follow them or click on a link to view their profiles.

### End Result, Step 1🏅- `http://localhost:3000`
How do we test this, you ask?

At the end of Step 1, you should be able to login, view profile pages (and edit user details), view other profiles, and request and verify friendships.

Hooray! You've just built the fundamentals of a social network! Now it's time to take those users and associate more data with them in the form of restaurants and their reviews.


## Step 2: Creating and Viewing Restaurants 🍔
###Restaurant Models 🍚 - `models/models.js`

- **Name**
- **Category**
- **Location** (`String`) - a _descriptive_ location - this location does not have coordinates! (ex. "Southern California", "Orange County", "Huntington Beach")


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

Give methods and field for each model.
All the fields and their types

Leave to them to write their own validation

Describe views with mockups but not routes


## Step 3: Reviewing Restaurants ⭐
