# Building Yelp Part 2!

**What is indexing?**

Indexing is a way of sorting documents on multiple fields. Creating an index on a field in database creates another field that
holds the index value, and pointer to the record it relates to. This index structure is then sorted, allowing for faster searches, queries.
This uses the same principle as the Hash-Table indices that pointed to an object.

**Why is it needed?**

Data is stored as blocks on disks. These blocks are read in their entirety. These blocks work like a linked list, where each block contains
sections for data and a pointer to the next part in data. So, for example, block1 is at the end of the disk, and it points to block2 at the
beginning of it.

So, to find something in a field, we require an average of N/2 block accesses to find the information, where N is the number of blocks. Thus the performance increase is substantial if we would have only one place to find information in. The indexes work like a book index. The system finds the index, that is previously sorted and then it points to the correct location on disk. So, the process for finding a restaurant would be:
Find restaurant in index table, read where it points to, read location.

1. Unique Index on username.

* Hint: If you have users on your database that are duplicated, please delete them
before adding a unique index. Otherwise it will generate an error.

Unique indexes are created by doing:
```
var Restaurant = new Schema({
    name: { type: String, unique: true }
})

// or

var Restaurant = new Schema({
    name: { type: String, index: { unique: true } }
})
```
For list view page:

##Phase 1 Sort Dropdown
1. Sort by price, alphabetical. Sort can be in Increasing or decreasing order.
- These are actual fields on db, properties of our restaurants.
-	Add a form of GET type on your Restaurants page. Add two drop-downs. one named "Sort By" and one named order for Ascending/Descending.
1. Sort by stars
- Mongo doesn't support joins, so the database engine doesn't know how many stars a restaurant has.
Stars are currently virtual, meaning they get calculated on Mongoose, not on mongo.
- Create a new field called "stars" on the restaurant's model. Additionaly, we need to recalculate these every time someone leaves a review for a restaurant, computing the average.
- Create a number of reviews field on the databaseToo. This will be calculated when a user leaves a review too.
- Sort out by using the stars field when the user selects sort by stars.

##Phase 2 Distance
1. Sort by distance:
- Calculate current user's location. On latitude+longitude / Get it with maps API.
- Get the restaurant's latitude+longitude
- Calculate individual distances using the formula sqrt( square(latitude2-latitude2) + square(longitude-longitude2) )
- Sort.

##Phase 3 Search Functionality
1. New query: Case-folded name field for search. (write name to lower case field).
- Add a search form with a name field to your restaurants page.
-	Users can write queries in many different forms. For example "Cat" or "cát" would yield different results. To fix this,
we have to case-fold texts, meaning making them as plain as possible, and as standard as possibe. Take a look at this link and try case-folding yourself! http://www.alistapart.com/articles/accent-folding-for-auto-complete/
1. Single field index (on folded name) that starts with name.
- Create a new field on users that contains the folded name that you are looking for.
- Create an index for that field, allowing you you query faster through folded names.
1. Write a prefix query on the thing that you are searching
- Create a query that finds users that start with the prefix, using the new index.
1. Composite indexes
- MongoDB supports compound indexes, where a single index references many fields in a document:
`db.collection.createIndex( { <field1>: <type>, <field2>: <type2>, ... } )` The value of the field in the index specification describes the kind of index for that field. For example, a value of 1 specifies an index that orders items in ascending order. A value of -1 specifies an index that orders items in descending order.
- An example of creating a compound index is `{ userid: 1, score: -1 }` it holds two fields in one index.
- The user is sort out ascending by userId, and descending by score.

- Lets say you have our restaurants:
```
{
	"_id": ObjectId(...),
	"name": "McDonalds",
	"location": "4th Street Store",
	"stars": 4
}
```
- To create an ascending index on item and stock you would:
` db.products.createIndex( { "name": 1, "stars": 1 } ) `
- The index supports queries on the item field as well as both item and stock fields:
`db.products.find( { item: "name", stars: { gt: 5 } } )`

* Show them explain plan as you go - make them take out index and re-insert index

##Bonus:
1. Use Yelp API or open street API to get JSON file of businesses
