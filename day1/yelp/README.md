# Building Yelp!


Today we will be building a clone of the popular restaurant reviews website Yelp, using your knowledge of MongoDB queries, processing, and performance. Yay!


## Table of Contents

- **The Big Picture** 🖼
- **Step 0:** Authentication 🔐
- **Step 1:** Connecting Users 🙇
- **Step 2:** Creating and Viewing Restaurants 🍔
- **Step 3:** Reviewing Restaurants ⭐
- **Phase 1 Challenges** 🏆

## The Big Picture 🖼

Yelp is a big project. Refer back to this section if you're ever feeling lost and need to see where this is all going. Below is a reference to all of the models we will be using in this project. More detailed information on their implementations and applications can be found in their respective sections! 

Alternatively, you could try structuring the application solely from **The Big Picture**, if you're up for the challenge.

**Users** (Step 1)

- `User` **Schema properties** - the model for all users of your application (_see **User Models**_)
	- `displayName` - the displayed name for a User when visiting their profile
	- `email` - used for authentication, should not be publicly available
	- `password` - used for authentication, definitely should not be publicly available
	- `location` - the displayed location for a User - not coordinates! Just a quick description of where they are in the world.
	- `reviews`
	- `friendships`
- `User` **Schema methods** - methods that your models will inherit to be called from in your routes
	- `getFriends(cb)` - return array of friends as User objects in callback `cb`
	- `getReviews(cb)` - return array of reviews as Review objects in callback `cb`
	- `follow(idToFollow, cb)` - create and save a new `Follow` object with `this._id` as the `follower` (see below) and `idToFollow` as `following`
	- `unfollow(idToUnfollow, cb)` - find and delete a `Follow` object (if it exists!)
	- `isFollowing(user)` - return whether or not the user calling `isFollowing` is following the User model 
	
**Follows** (Step 1)

- `Follow` - the model that is used to identify a relationship between a User and another they are following (_see **Follows!**_)
	- `follower` - the ID of the User following another
	- `following` - the ID of the User being followed

**Restaurants** (Step 2)

- `Restaurant` **Schema properties** - the model that identifies a restaurant
	 - `name` - The name of the Restaurant
	 - `price` - A Number on a scale of 1-3 (which you could represent on the page as "$", "$$", "$$$" or "Cheap", "Fair", "Expensive" or whatever you want!)
	 - `category` 
- `Restaurant` **Schema methods** - methods for your Restaurant models
	- `getReviews(cb)` - return an array of Review objects in callback `cb`

**Reviews** (Step 3)

- `Review` - the model that 


## Step 0: Authentication 🔐 - `app.js`, `routes/index.js`,  `models/models.js`
👀 **Note:** this is a read-only Step - _No writing code here, but make sure to read through, familiarize yourself with the authentication flow, and add your MongoDB details!_

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

### User Models ⛷ - `models/models.js (UserSchema)`

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

### Follows! 👫 - `models/models.js (FollowSchema)`

Follows are awesome, but they are also a little complicated. We _could_ choose to add to an array of usernames representing friends to _each_ User, but that would mean we would have to update two users every time a friendship was created. Instead, we'll keep track of each User's relationship with another model - the `Following`.

Here are the properties you'll want to define for each of your Follows:

- **User ID 1** (`mongoose.Schema.Types.objectId`) (for this part, order does matter) - the ID of the user that follows the other.
- **User ID 2** (`mongoose.Schema.Types.objectId`) - The id of the user being followed

Note that this is the Twitter way of following. One can follow the other without being followed.

> ⚠️  **Warning:** Careful about creating duplicate follows! You should be only creating a new Follows document if it doesn't already exist - make sure you handle this in your routes below.

### Creating User Methods ☃️ - `models/models.js (UserSchema)`


Next, you want to create a function for each of the `User` models that allows us to take the Reviews array, which is **only a group of IDs referring to objects** and convert that into an array of **actual Review objects.**

We will accomplish this by using Mongoose _methods_. The way we write Mongoose methods is like the following:

```
var userSchema = new mongoose.Schema({...});
userSchema.methods.yourMethodName = function() {
	/* define your method here! */
};
```

We want to write the following methods on our `User` Schema:

> **Tip:** When creating your methods for `User`, use _callback functions_ to return data. For example, `getFollows` should be _used_ in a future route like:

	req.user.getFollows(function(followers, following) {
		/* do something with the result of the callback function */	
	});
	
> To accomplish this, your implementation should take a parameter that represents a callback function that will later be called with the resulting data. See more about this below.

 
- `follow` - should set a following relationship as on Twitter, Instagram, or any site that supports followers.
	- **Note**: `follow` will be an _instance method_ that acts upon a user - it would be defined in the schema as something along the lines of:
	
	```
	userSchema.methods.follow = function (idToFollow, callback){...}
	```
	You should take in a parameter `idToFollow` of the user to follow; now, calling `.follow` on the logged-in user will follow the user given by `idToFollow`! `follow` should also check if you have followed that user already and prevent you from creating duplicate `Follow` documents.

- `unfollow` - deletes the relationship represented by a `Follow` document where User 1 (the caller of the `unfollow` function) follows User 2 (given by a parameter `idToUnfollow`).

- `getFollows` - This method will go through and find all `Follow` documents that correspond to both user relationships where the user's ID (accessible by the caller of the function, `this._id`) is the `follower` and where the user is the `following` of a `Follow` relationship. In other words, you want **both the Users the user follows and the Users the user is being followed by** returned by this function. This should call the callback method with the followers and users you are following with something like `allFollowers` and `allFollowing`. 

	When first retrieving the correct `Follow` documents relevant to a user, your `allFollowers` and `allFollowing` arrays will look something like:
	
	```
	allFollowers = [{
		follower: ID_OF_FOLLOWER,
		following: YOUR_USER_ID
	}, {
		follower: ID_OF_FOLLOWER,
		following: YOUR_USER_ID
	}];
	
	allFollowing = [{
		follower: YOUR_USER_ID,
		following: ID_OF_USER_YOU_ARE_FOLLOWING
	}]
	```


	After using `.populate`, your data will look like this (callback with this populated set!):

	```
	allFollowers = [{
		follower: {
			_id: ID_OF_FOLLOWER,
			displayName: "Moose Paksoy",
			email: "moose@joinhorizons.com",
			location: "San Francisco",
			reviews: [Array],
			friendships: [Array]
		},
		following: YOUR_USER_ID
	}, {
		follower: {
			_id: ID_OF_FOLLOWER,
			displayName: "Fast Lane",
			email: "lane@joinhorizons.com",
			location: "New York City",
			reviews: [Array],
			friendships: [Array]
		},
		following: YOUR_USER_ID
	}];
	
	allFollowing = [{
		follower: YOUR_USER_ID,
		following: {
			_id: ID_OF_USER_YOU_ARE_FOLLOWING,
			displayName: "Josh",
			email: "josh@joinhorizons.com",
			location: "Rutgers",
			reviews: [Array],
			friendships: [Array]
		}
	}]
	```
	
	Notice how the `follower` field for `allFollowers` and the `following` field for `allFollowing` for the populated set of data has been transformed from an ID (`ID_OF_FOLLOWER` or `ID_OF_USER_YOU_ARE_FOLLOWING`) to an actual User object. Use Mongoose's [`.populate()`](http://mongoosejs.com/docs/api.html#model_Model.populate) to populate the correct fields and accomplish this.


**Tip**: you can refer to the current model that is calling a method using the `this` keyword - a lot like an object and its function prototypes! Keep in mind that to call `.populate`, you will have to run:

`this.model("User OR YOUR MODEL NAME").populate(this, {opts...}, function(err, user) {...})`


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

### End Result, Step 2🏅- `http://localhost:3000`
At this point, you should be able to view Restaurants in both a complete listing (with view paging) as well as individual Restaurants with their details of location, category, and price. 

It is important to note that up until this point, we have not connected users to the restaurants themselves; that will come with Reviews. Get ready!


## Step 3: Reviewing Restaurants ⭐

### Review Models 📝 - `models/models.js`


### Reviews

Reviews are a schema by themselves. A review contains the id of the user leaving the review, the id of the restaurant
receiving the review. So for example Mike -> reviews -> McDonalds. Those must be of id types and not arrays.
You also need to have a content and number of stars you are leaving on the review

- `restaurant.getReviews` - This function should go through the array of Review IDs of the current model and return an array of the actual Review documents for that restaurant. It will be used in the restaurant page.

### End Result, Step 3🏅- `http://localhost:3000`
Amazing! You've completed Phase 1 of the Yelp project. You should be able to perform all of the basic functions of Yelp - from logging in and making friends to posting reviews and looking up restaurants. 

The most significant result from this step will be to have given logged-in users the ability to review restaurants and display those reviews on both User profiles and Restaurant listings. 

Tomorrow, we'll be delving into 

## Phase 1 Challenges 🏆
You've made it this far, and early. Why not a few challenges?

- Try allowing for 	

