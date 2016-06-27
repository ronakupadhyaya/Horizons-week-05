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

Your job is to take the specifications for each model and determine, with your views, how many routes you *have*, what they are *called*, and what they *do*.

Take a deep breath; you've got this!

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

Use Mongoose's [`.populate()`](http://mongoosejs.com/docs/api.html#model_Model.populate) to populate your user and **return the array of your user's Review or User (friend) objects**. You will have to do a little more for `getFriends`, since a Friendship document is not what you want back - you want an array of Users back.

You do not have to populate the `reviews` and `friendships` fields of the User documents, but you may find it helpful to list the number of friends and reviews that a person has when displaying them on your friends list!


> **Tip**: you can refer to the current model that is calling a method using the `this` keyword - a lot like an object and its function prototypes! Keep in mind that to call `.populate`, you will have to run:

> `this.model("User OR YOUR MODEL NAME").populate(this, {opts...}, function(err, user) {...})`



### Friendships! 👫 - `models/models.js`

Friendships are awesome, but they are also a little complicated. We _could_ choose to add to an array of usernames representing friends to _each_ User, but that would mean we would have to update two users every time a friendship was created. Instead, we'll keep track of each User's relationship with another model - the `Friendship`.

Here are the properties you'll want to define for each of your Friendships:

- **User ID 1** (`mongoose.Schema.Types.objectId`) (for this part, order does not matter) - the ID of one of the users party to the friendship
- **User ID 2** (`mongoose.Schema.Types.objectId`) - the ID of the other user party to the friendship

Note that we will not keep track of friend requests for this purpose of this exercise; that's a bonus! Once a user adds a new friend, both will be friends. 

> ⚠️  **Warning:** Careful about creating duplicate friendships! You should be only creating a new Friendship document if it doesn't already exist - make sure you handle this in your routes below.

### Viewing Profiles 👸 - `views/singleProfile.hbs`
Time to put the views together! You'll be first creating the Handlebars template for displaying a user's single profile page. The information you'll need to display here is largely what you've already defined in the models.

Display something that looks like the following:

[mockup here]

When creating your Single Profile template, imagine that you are passing in the following context object into the template (_you are responsible for actually passing this into your template_ when you `.render` your route in the following sections!):

```
{
	user: {
		_id: 575xxxxxxxxxxxx,
		displayName: "Ethan Lee",
		email: "ethan@joinhorizons.com",
		location: "Probably making a PB&J",
		reviews: [{
			_id: 575xxxxxxxxxxxx,
			restauraunt: 575xxxxxxxxxxxx,
			content: "This food was okay"
		}],
		friendships: [{
			_id: 575xxxxxxxxxxxx,
			displayName: "Abhi Fitness",
			email: "abhi@joinhorizons.com",
			location: "The Gym",
			reviews: [Array of IDs],
			friendships: [Array of IDs]
		}]
	}
}
```

You'll want to display all the information you have so far, including:

* **Display Name** `{{user.displayName}}` _in the context object above_: show the name of a user currently being viewed 
* **Location** `{{user.location}}`: the descriptive location of a user
* **Friends** `{{#each user.friendships}}...{{/each}}` display some details about the user's friends, including:
	* **Display Name** -  `{{displayName}}`
	* **Location** - `{{location}}`
	* **Number of Friends** - `{{user.friendships.length}}`
	* **Number of Reviews** - `{{user.reviews.length}}`
	

### Editing Profiles ✏️ - `views/editProfile.hbs`

You also want to let users that are currently logged in to edit their own profiles. The only fields that a single user will ever be editing could be Display Name, Email, or Location. Users will make Friends via the User Directory (below, `views/profiles.hbs`) and create Reviews on single Restaurant views. It should look something like the following:

[mockup here]

Remember, you'll want to set up a form for this view that `POST`s your newly updated user's data to save their model. Keep the `name` attributes you choose in the back of your mind - you'll be setting up the route to handle this form two sections from now!


### Viewing ALL the Profiles 🏃 - `views/profiles.hbs`
To have a central directory of Users where people can make friends, we will have a template dedicated to displaying all of the Users registered for our site. The result will look like:

[mockup here]

This time, your context object will have a property called `users` (or something similar), full of User documents. Keep in mind that in this view, you don't need to display the specific friends or reviews a user has (a count will suffice).

You will also want to display a button to "Add Friend" conditionally on whether or not the user accessing the page is already friends with a particular user. We'll give you a tip on how to do that below; for now, set something up like the following:

```
{{#each users}}
	<!-- your code for displaying a user's details here -->
	{{#if friend}}
		<!-- no button to add friend, just something that says: "Friends ✅" -->
	{{else}}
		<!-- link/button to add a friend -->
	{{/if}}
{{/each}}
``` 

**Note:** the boolean `friend` does not refer to an actual property we have in the User model yet - we'll explain how to set that up below.


### Adding the Routes 🌀 - `routes/index.js`
Now that you have the view templates and models for setting up Users and their relationships (Friendships), it's time to make it all accessible through Express routes (`router.get` and `router.post`!).

As aforementioned, we are going to leave many of these design decisions up to you - but here's a few routes that you'll _definitely_ need to have.

* A route to a single profile page (`singleProfile.hbs`) based on an ID (as a part of the URL, i.e. `/users/575xxxxxxxxx`) - pass in the relevant details of a User and their populated friends list. 
* A route to render the `editProfile` template for the currently logged in User.
* A route to render `profiles.hbs` with all the Users registered on your site
	* One way you could make the distinction for a User's friends would be something along the lines of:
	
	```
	User.find(function(err, users) {
		res.render('profiles', {
			users: users.map(function(user) {
			// Does the currently logged-in user's friendships array include this user's ID? 
				if (req.user.friendships.indexOf(user._id) > -1) {
					user.friend = true;
				} else {
					user.friend = false;
				}
				return user;
			})
		})
	});
	
	```

> ⚠️  **Warning:** You only want to show this view to 



* ⚠️ Don't forget to include a link to edit a profile 

### End Result, Step 1🏅- `http://localhost:3000`
Time to step back and take a look at your hard work!

At the end of Step 1, you should be able to login, view profile pages (and edit user details), view other profiles, and create friendships. 

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

