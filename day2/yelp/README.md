# Building Yelp Part 2!

Today, we will be using indexes to build on your work from yesterday to optimize performance and build out features for searching and filtering.

**Note:** Because this project will be continued from **Yelp Part 1**, we will be working in the same project files. There is no scaffolding for this Part!

## Table of Contents

* **Recap** 🔁
* **Step 1:** Paging Your Results 📋
* **Step 2:** Sorting Restaurants with Indexes 📊
* **Step 3:** Full-Text Search 🔭
* **Part 2 Challenge** 🏆 

## Recap 🔁

**What is indexing?**

Indexing is a way of sorting documents on multiple fields. Creating an index on a field in database creates another field that holds the index value, and pointer to the record it relates to. This index structure is then sorted, allowing for faster searches, queries.
This uses the same principle as the hash table indices that pointed to an object.

**Why is it needed?**

Data is stored as blocks on disks. These blocks are read in their entirety. These blocks work like a linked list, where each block contains sections for data and a pointer to the next part in data. So, for example, block1 is at the end of the disk, and it points to block2 at the beginning of it.

So, to find something in a field, we require an average of N/2 block accesses to find the information, where N is the number of blocks. Thus the performance increase is substantial if we would have only one place to find information in. The indexes work like a book index. The system finds the index, that is **previously sorted** and then it points to the correct location on disk. 

In this case, finding a restaurant would be as simple as finding the restaurant in the index table, reading where it points to, and reading data from its location.

1. Unique Index on username.

* Hint: If you have users on your database that are duplicated, please delete them
before adding a unique index. Otherwise it will generate an error.

In Mongoose, we can create new indexes like the following:

```
var Restaurant = new Schema({
    name: {
    	type: String, 
    	unique: true
    }
})

// or

var Restaurant = new Schema({
    name: {
    	type: String, 
    	index: {
    		unique: true 
    	}
    }
})
```

Check out [**Mongoose documentation**](http://mongoosejs.com/docs/guide.html) (scroll down to _Indexes_) to see more about usage of indexes wiht Mongoose.


##Step 1: Paging Your Results 📋
The first thing we'll do is page your Restaurant results to allow for displaying large quantites of Restaurants to be more manageable. This time, we'll start with our routes, since understanding how paging will work will begin with the URL.

### Rerouting Routes 📤 - `routes/index.js`
Previously, you rendered the `restaurants.hbs` template with a single `GET` request to query for all of your Restaurant documents and pass them in. With paging, you will be rendering the same view, but changing the documents you pass in. You can accomplish this by making use of the query string! 

For example, given a database with 25 restaurants:

* `http://localhost:3000/restaurants/list/1` should render the first 10 `(0-9)`.
* `http://localhost:3000/restaurants/list/2` should render the next 10 `(10-19)`.
* `http://localhost:3000/restaurants/list/3` should render the remaining 5 `(20-24)`.

> ⚠️ **Warning**: Be careful about the names of your routes! If you already have routes set up for `GET /restaurants/:id`, you should access your list view by a separate URL - in this example we have it at `/restaurants/list/:x`.

Begin by setting up your routes to take in this new parameter (which is just a number) and for now, simply render your `restaurants` view the way you've always been doing and log your new parameter to keep it in the back of your mind. We'll use it soon!

**Note:** Keep your previous `GET /restaurants` route intact! You'll want to update it to only pass in the first 10 documents.

### Modifying Models 💽 - `models/models.js (RestaurantSchema)`
We want to change the way we query for Restaurants to only give us back the set of 10 that we need. To do this, we'll create a **static** on our `Restaurant` model.

> **Tip:** The key difference between a **static** and a **method** in Mongoose is what they _are called on_. Instance _methods_ are called on a per-document basis; `this` for methods refers to one document. _Statics_ on the other hand are called on a per-model basis; `this` for statics refers to an entire model.

The reason that we want to use a _static_ here is because we essentially want to create a model `find` method that doesn't exist - something along the lines of `findTheNextTen` (which is not a thing in Mongoose, sorry!).

The way we define a static in Mongoose is identical to how we define a method, with the slight change:

```
RestaurantSchema.statics.yourStaticNameHere = function(anyParams) {
	/* your static definition here */
}
```

You want to define a static that takes in any integer `n` (received from your route parameters, it could be 1, 2, 99, etc.) and finds the next multiple of 10 restaurants to query for in your database.

Your static should also take a callback `cb` to call with an array of no more than 10 Restaurants after the query executes successfully. Your static will be called from routes like the following:

```
app.get("/restaurants/list/:x", function(req, res) {
	// Below, the static is called getTen, but the name is up to you!
	Restaurant.getTen(req.params.x, function(restaurants) {
		res.render(...);
	});
});
```

**Hint:** To retrieve the next multiple of 10 restaurants, you will be using [`.skip()`](http://mongoosejs.com/docs/api.html#query_Query-skip) (which "skips" a certain number of documents in the database as a part of the query) and [`.limit()`](http://mongoosejs.com/docs/api.html#query_Query-limit) (which sets a cap on the number of documents returned)! Chain these together and retrieve the result using `.exec()` to write this static. 

### A Return to Routes 📥 - `routes/index.js`
To implement your model static functions in your routes, simply call it on the model (which in your case is probably called `Restaurant` or `models.Restaurant`) and pass in the callback function to handle the results of the query. 

Make sure to render your `restaurants` template with the correct data _within_ this callback function! Before moving on to **Reviewing Views** 🚢, verify that you are able to access different reuslts in your database by paging as mentioned before:

For a database of 25 restaurants:

* `http://localhost:3000/restaurants/list/1` should render the first 10 `(0-9)`.
* `http://localhost:3000/restaurants/list/2` should render the next 10 `(10-19)`.
* `http://localhost:3000/restaurants/list/3` should render the remaining 5 `(20-24)`.

**Note:** You may find that you need to add more restaurants to your database before you are able to make this functional. Check your mLab to verify that there are more than 10 restaurants that you can page through!

### Reviewing Views 🚢 - `views/restaurants.hbs`
Now that you are able to access any 10 restaurants using a part of the URL parameters to change where you are, it's time to update your view to reflect these changes!

You want a component that looks something like the following at the bottom of your page:

<img src="http://cl.ly/0a1R0V0b2w26/Image%202016-06-28%20at%208.12.41%20AM.png" height="50">

Each page number should act as a link to your route `GET /restaurants/list/PAGE_NUMBER` (or whatever you may have called it). One resource you can use to create the styling for this pagination component is on Bootstrap's handy documentation: [http://getbootstrap.com/components/#pagination](http://getbootstrap.com/components/#pagination).

Keep in mind that you only want to render a certain number of these paging links that reflects `the number of restaurants in your database / 10`!

**Suggestion:** You might use [`Restaurant.count`](http://mongoosejs.com/docs/api.html#model_Model.count) after retrieving the results from your static method to also pass in the total number of documents to your pagination component! Note that both `.count()` and your own static method both require callbacks as parameters.

### End Result, Step 1 🏅 - `http://localhost:3000`

After this step, you will be able to visit your Restaurant listings page and have the ability to click through pages of 10 restaurants at a time, using a component or list of links at the bottom with the correct number of pages to navigate through your entire collection of Restaurant documents.


##Step 2: Sorting Restaurants with Indexes 📊
Next, we'll be adding some more features to the restaurant listings template that will allow us to find what we are looking for with a more fine-grained search - say, by highest rating or by closest location. We will accomplish this by use of indexes for optimal performance!

### More Model Modifications 👋 - `models/models.js`
First off, some modifications to our `Restaurant` model. Remember our virtual `averageRating` (the one that calculated `totalScore / reviewsCount` for us on the fly)? 

The trouble with this virtual is that although it is available to us seemingly wherever we need, it is notably missing **_in the MongoDB database itself_**. This is because the `virtual` is a Mongoose-specific property that is a part of our models, being "virtually" available to us but not persisting to the actual MongoDB document. If we want to be able to index by `averageRating` (and thus allowing us to sort Restaurants by rating with much greater performance), we will have to change this from a virtual to an actual property.

Add a property `averageRating` (of type _Number_) that is recalculated (using the existing `totalScore` and `reviewsCount` properties) and saved to the model every time a new `Review` is posted. 

Your completed Restaurant Schema will look like the following:

 - `name` - The name of the Restaurant
 - `price` - A Number on a scale of 1-3
 - `category` - A String that describes the type of restaurant represented
 - `latitude` - A Number representing the geographic location of the restaurant
 - `longitude` - Another Number representing the geographic location of the restaurant
 - `openTime` - A Number from 0-23 representing the hour the restaurant opens
 - `closingTime` - A Number from 0-23 representing the hour the restaurant closes
 - `totalScore` - A Number that represents the total stars a Restaurant has from all Reviews associated with it
 - `reviewsCount` A Number that represents the total amount of Reviews a Restaurant has associated with it
 - `averageRating` - A Number that represents the average rating that a Restaurant has across all of its reviews, on a scale of 1-5
 
Alright! Now that we have a persistent property on our MongoDB documents that we are able to use for indexing, it's time to create those in our model!

### Adding Indexes to Your Models 🕵 - `models/models.js`
Adding indexes to your Mongoose model is [pretty easy](http://mongoosejs.com/docs/guide.html) - all you need to do is add an extra field to one of your properties that looks like the following:

```
var restaurantSchema = new mongoose.Schema({
	...
	name: {
		type: String,
		index: true
	}
})

```

This will allow you to run a fast sort through any of your `find` queries, which looks something along the lines of:

```
// Accepted values for "ascending" sort are 1, "asc", and "ascending"
// Accepted values for "descending" sort are -1, "desc", and "descending"

Restaurant.find({}).sort({'name': 1}).exec(function(err, restaurants) {...})

```



### Supporting Filtering in Your Views - `views/restaurants.hbs`


### End Result, Step 2 🏅 - `http://localhost:3000`

1. Sort by price, alphabetical. Sort can be in Increasing or decreasing order.
- These are actual fields on db, properties of our restaurants.
-	Add a form of GET type on your Restaurants page. Add two drop-downs. one named "Sort By" and one named order for Ascending/Descending.
1. Sort by stars
- Mongo doesn't support joins, so the database engine doesn't know how many stars a restaurant has.
Stars are currently virtual, meaning they get calculated on Mongoose, not on mongo.
- Create a new field called "stars" on the restaurant's model. Additionally, we need to recalculate these every time someone leaves a review for a restaurant, computing the average.
- Create a number of reviews field on the databaseToo. This will be calculated when a user leaves a review too.
- Sort out by using the stars field when the user selects sort by stars.


1. Sort by distance:
- Calculate current user's location. On latitude+longitude / Get it with maps API.
- Get the restaurant's latitude+longitude
- Calculate individual distances using the formula sqrt( square(latitude2-latitude2) + square(longitude-longitude2) )
- Sort.


## Step 3: Pagination & Sorting Extended

### Pagination + Sorting

### Custom Pagination




