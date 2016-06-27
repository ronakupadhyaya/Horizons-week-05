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

**Users** (Step 1, 3)

- `User` **Schema properties** - the model for all users of your application (_see **User Models**_)
	- `displayName` - the displayed name for a User when visiting their profile
	- `email` - used for authentication, should not be publicly available
	- `password` - used for authentication, definitely should not be publicly available
	- `location` - the displayed location for a User - not coordinates! Just a quick description of where they are in the world.
- `User` **Schema methods** - methods that your models will inherit to be called from in your routes
	- `follow(idToFollow, cb)` - create and save a new `Follow` object with `this._id` as the `follower` (see below) and `idToFollow` as `following`
	- `unfollow(idToUnfollow, cb)` - find and delete a `Follow` object (if it exists!)
	- `getFollows(cb)` - return array of followers and users followed as User objects in callback `cb`
	- `isFollowing(user)` - return whether or not the user calling `isFollowing` is following the User model 
	- `getReviews(cb)` - _Completed in Step 3:_ return array of reviews as Review objects in callback `cb`
	
**Follows** (Step 1)

- `Follow` - the model that is used to identify a relationship between a User and another they are following (_see **Follows!**_)
	- `follower` - the ID of the User following another
	- `following` - the ID of the User being followed

**Restaurants** (Step 2, 3)

_Completed in Step 2_

- `Restaurant` **Schema properties** - the model that identifies a restaurant
	 - `name` - The name of the Restaurant
	 - `price` - A Number on a scale of 1-3 (which you could represent on the page as "$", "$$", "$$$" or "Cheap", "Fair", "Expensive" or whatever you want!)
	 - `category` - A String (may be an `enum` if you want to limit its possible options) that describes the type of restaurant represented, i.e. "Korean" or "Barbeque."
	 - `latitude` - A Number representing the geographic location of the restaurant
	 - `longitude` - Another Number representing the geographic location of the restaurant
	 - `openTime`
	 - `closingTime`
	 
_Completed in Step 3_

- `Restaurant` **Schema methods** - methods for your Restaurant models
	- `getReviews(cb)` - return an array of Review objects in callback `cb`
- `Restaurant` **Schema virtuals** - virtuals for your Restaurant models
	- `stars` - return the average rating of a Restaurant based on its number of reviews

**Reviews** (Step 3)

- `Review` **Schema properties** - the model that defines a single review on a Restaurant
	- `stars` - A Number (1-5) that defines how many stars were given in the review
	- `content` - A String with the contents of the Review
	- `restaurant` - the ID of the Restaurant that was reviewed
	- `user` the ID of the User who posted the review


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
Now we’ll be adding more properties to our users in our database model to give them followers and reviews. Notice how we are *not* providing you with the typical scaffolding for each route!

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
- **Email** (`String`) - email used for authentication
- **Password** (`String`) - hashed password used for authentication
- **Location** (`String`) - descriptive location for a User (a bio, of sorts)

### Follows! 👫 - `models/models.js (FollowSchema)`

Follows are awesome, but they are also a little complicated. We _could_ choose to add to two arrays of usernames representing followers/users following to _each_ User, but that would mean we would have to update two users every time someone was followed. Instead, we'll keep track of each User's relationship with another model - the `Follow`.

Here are the properties you'll want to define for each of your Follows:

- **User ID 1** (`mongoose.Schema.Types.objectId`, `ref: User`) (for this part, order does matter) - the ID of the user that follows the other.
- **User ID 2** (`mongoose.Schema.Types.objectId`, `ref: User`) - The ID of the user being followed

Note that this is the Twitter way of following. One can follow the other without being followed.

> ⚠️  **Warning:** Careful about creating duplicate follows! You should be only creating a new Follows document if it doesn't already exist - make sure you handle this in your routes below.

### Creating User Methods for Followers ☃️ - `models/models.js (UserSchema)`


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
			location: "San Francisco"
		},
		following: YOUR_USER_ID
	}, {
		follower: {
			_id: ID_OF_FOLLOWER,
			displayName: "Fast Lane",
			email: "lane@joinhorizons.com",
			location: "New York City"
		},
		following: YOUR_USER_ID
	}];
	
	allFollowing = [{
		follower: YOUR_USER_ID,
		following: {
			_id: ID_OF_USER_YOU_ARE_FOLLOWING,
			displayName: "Josh",
			email: "josh@joinhorizons.com",
			location: "Rutgers"
		}
	}]
	```
	
	Notice how the `follower` field for `allFollowers` and the `following` field for `allFollowing` for the populated set of data has been transformed from an ID (`ID_OF_FOLLOWER` or `ID_OF_USER_YOU_ARE_FOLLOWING`) to an actual User object. Use Mongoose's [`.populate()`](http://mongoosejs.com/docs/api.html#model_Model.populate) to populate the correct fields and accomplish this.

- `isFollowing` - this method will take in another User ID and return true or false based on whether or not the user calling `isFollowing` (`this`) is following the user represented by the ID passed in. Query for a Follow document where `follower` is `this._id` and `following` is the ID passed in, and return `true` if the resulting query 



**Tip**: you can refer to the current model that is calling a method using the `this` keyword - a lot like an object and its function prototypes! Keep in mind that to call `.populate`, you will have to run:

`this.model("User OR YOUR MODEL NAME").populate(this, {opts...}, function(err, user) {...})`


### Viewing Profiles 👸 - `views/singleProfile.hbs`
Time to put the views together! You'll be first creating the Handlebars template for displaying a user's single profile page. The information you'll need to display here is largely what you've already defined in the models.

Display something that looks like the following:		

[mockup here]		
  		  
 When creating your Single Profile template, imagine that you are passing in the following context object into the template (_you are responsible for actually passing this into your template_ when you `.render` your route in the following sections!):		
 		
 ```		
 {		
 	user: {		
 		_id: YOUR_USER_ID,		
 		displayName: "Ethan Lee",		
		email: "ethan@joinhorizons.com",		
		location: "Probably making a PB&J"		
 	},		
 	reviews: [{		
 		_id: 575xxxxxxxxxxxx,		
 		restauraunt: 575xxxxxxxxxxxx,		
 		content: "This food was okay"		
	}],		
 	allFollowers: [{	
 		follower: {	
	 		_id: ID_OF_FOLLOWER,		
	 		displayName: "Abhi Fitness",		
	 		email: "abhi@joinhorizons.com",		
	 		location: "The Gym"
 		},
 		following: YOUR_USER_ID
 	}],
 	allFollowing: [{
		follower: YOUR_USER_ID,
		following: {
			_id: ID_OF_USER_YOU_ARE_FOLLOWING,
			displayName: "Josh",
			email: "josh@joinhorizons.com",
			location: "Rutgers"
		}
	}]
 }		
 ```

You'll want to display all the information you have so far, including:

 * **Display Name** `{{user.displayName}}` _in the context object above_: show the name of a user currently being viewed
 * **Location** `{{user.location}}`: the descriptive location of a user
 * **Followers** `{{#each allFollowers}}...{{/each}}` display some details about the user's followers, including:
 	* **Display Name** -  `{{follower.displayName}}`
 	* **Location** - `{{follower.location}}`
 * **Following** `{{#each allFollowing}}...{{/each}}` display some details about the users that the user is following, including:
 	* **Display Name** -  `{{following.displayName}}`
 	* **Location** - `{{following.location}}`
 	
### Viewing ALL the Profiles 🏃 - `views/profiles.hbs`

To have a central directory of Users where people can follow others, we will have a template dedicated to displaying all of the Users registered for our site. The result will look like:

[mockup here]

You will also want to display a button to "Follow" conditionally on whether or not the user accessing the page is already following a particular user - remember that `isFollowing` method we wrote?

You can call that method from Handlebars using a line inside of an `each` loop like: `{{#if this.isFollowing(../user)`, given that the context object looks like: `{user: req.user, users: [Array]}` - the `../` notation will give you a parent scope in Handlebars.

### Adding the Routes 🌀 - `routes/index.js`
Now that you have the view templates and models for setting up Users and their relationships (Follows), it's time to make it all accessible through Express routes (`router.get` and `router.post`!).

As aforementioned, we are going to leave many of these design decisions up to you - but here's a few routes that you'll _definitely_ need to have.

* A route to a single profile page (`singleProfile.hbs`) based on an ID (as a part of the URL, i.e. `/users/575xxxxxxxxx`) - pass in the relevant details of a User and their populated friends list. 
* A route to render `profiles.hbs` with all the Users registered on your site.
* A route to handle a user following or unfollowing another, and updating that `Follow` relationship accordingly

### End Result, Step 1🏅- `http://localhost:3000`
Time to step back and take a look at your hard work!

At the end of Step 1, you should be able to login, view profile pages, view other profiles, and follow other users.

Hooray! You've just built the fundamentals of a social network! Now it's time to take those users and associate more data with them in the form of restaurants and their reviews.


## Step 2: Creating and Viewing Restaurants 🍔
###Restaurant Models 🍚 - `models/models.js (RestaurantSchema)`
To start off the basics of the Restaurants model, let's create some fundamental properties for _what make a restaurant a restaraunt_. The ones we thought of are as follows:

- **Name** (`String`) - the name of the Restaurant
- **Category** (`String`) - the type of the Restaurant ("Korean", "Barbeque", "Casual")
- **Latitude** (`Number`) - the latitude of the Restaurant's location
- **Longitude** (`Number`) - the longitude of the Restaurant's location
- **Price** (`Number`) - the descriptive scaling of a restaurants price, on a scale of 1-3
- **Open Time**
- **Closing Time**

That's all for Restaurants for now - we will be giving them virtuals and methods when we create **Reviews** in Step 3!

### Creating Restaurants 💛 - `views/newRestaurant.hbs`
Create a basic form for creating a new restaurant with all of its basic information. In place of `latitude` and `longitude`, take in a single field for an `address` - in **Adding the Routes**, we'll show you how to geocode this address into coordinates you can store in your database. Your form should take each of the following inputs:

* A name for the new restaurant
* A category (could be a dropdown selector)
* The relative price of the restaurant's items - on a scale of 1-3 
* An address for geocoding to coordinates
* An open time
* A closing time

Keep your `name` attributes for each input of the form in the back of your mind - you'll need it when handling the `POST` request that will save the new restaurant as a MongoDB document. 

### Browsing Restaurants 🍺 - `views/singleRestaurant.hbs`
When displaying a single restaurant, you'll want to show all of the fields you created for the `Restaurant` model above. The end result should look something like the following:

[mockup here]

You can display a map by coordinates by using the [**Google Maps Static Maps API**](https://developers.google.com/maps/documentation/static-maps).
To 
create and see a static map, just insert an image in the following format:

```
<img src="https://maps.googleapis.com/maps/api/staticmap?center=[LATITUDE],[LONGITUDE]&markers=color:red|[LATITUDE],[LONGITUDE]&zoom=13&size=600x300&maptype=roadmap">
```

![](https://maps.googleapis.com/maps/api/staticmap?center=33.6434822,-117.5809571&zoom=15&size=600x300&maptype=roadmap&markers=color:red|33.6434822,-117.5809571)

As an example, this map of the middle of nowhere was created using the `src`: `https://maps.googleapis.com/maps/api/staticmap?center=33.6434822,-117.5809571&zoom=15&size=600x300&maptype=roadmap&markers=color:red|33.6434822,-117.5809571`.

For now, a restaurant will not display anything but its basic details and location. When we create the **Reviews** model in Step 3, we will revisit this view and add interface elements to create and view reviews on a restaurant.

### Browsing ALL the Restaurants 🍻 - `views/restaurants.hbs`

### Adding the Routes 🌀 - `routes/index.js`

### End Result, Step 2🏅- `http://localhost:3000`
At this point, you should be able to view Restaurants in both a complete listing (with view paging) as well as individual Restaurants with their details of location, category, and price. 

It is important to note that up until this point, we have not connected users to the restaurants themselves; that will come with Reviews. Get ready!


## Step 3: Reviewing Restaurants ⭐

### Review Models 📝 - `models/models.js (ReviewSchema)`

Reviews are a schema by themselves. A review contains the id of the user leaving the review, the id of the restaurant
receiving the review. So for example Mike -> reviews -> McDonalds. Those must be of id types and not arrays.
You also need to have a content and number of stars you are leaving on the review

- `restaurant.getReviews` - This function should go through the array of Review IDs of the current model and return an array of the actual Review documents for that restaurant. It will be used in the restaurant page.

### Creating Restaurant Methods and Virtuals for Reviews 🌪 - `models/models.js (RestaurantSchema)`
- `getReviews`

- `stars`


### Creating User Methods for Reviews 🍃 - `models/models.js (UserSchema)`
- `getReviews`

### Displaying Reviews on Profiles and Restaurants 🌋 - `views/singleRestaurant.hbs`, `views/singleProfile.hbs`

### Adding the Routes 🌀 - `routes/index.js`


### End Result, Step 3🏅- `http://localhost:3000`
Amazing! You've completed Phase 1 of the Yelp project. You should be able to perform all of the basic functions of Yelp - from logging in and making friends to posting reviews and looking up restaurants. 

The most significant result from this step will be to have given logged-in users the ability to review restaurants and display those reviews on both User profiles and Restaurant listings. 

Tomorrow, we'll be delving into 

## Phase 1 Challenges 🏆
You've made it this far, and early. Why not a few challenges?

- Add routes to allow for users to edit their profiles.
- Try allowing for private accounts and enforcing Follow Requests (like on Instagram) by adding a new property to both the `Follow` documents and `User` documents that specify the status of the follow and privacy of the user, respectively. Your view should display both accordingly.
- Make user action routes, such as follow and unfollow, AJAX-enabled so that the page does not refresh when following or unfollowing users from the user directory page.

