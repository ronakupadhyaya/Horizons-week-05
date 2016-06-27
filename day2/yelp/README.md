# Building Yelp Part 2!


1. Unique Index on username (done)
http://mongoosejs.com/docs/2.7.x/docs/indexes.html
* Hint: If you have users on your database that are duplicated, please delete them
before adding a unique index. Otherwise it will generate an error.

For list view page:
##Phase 1 Sort Dropdown
1. Increasing decreasing by price, stars, alphabetical.
1. Sort by stars (means no longer can be a virtual)
1. Sort by distance

##Phase 2 Search Functionality
1. New query: Case-folded name field for search. (write name to lower case field).
1. Single field index (on folded name) that start with name
1. Write a prefix query on the thing that you are searching

###Phase 3: Sorting and Searching combined
1. Composite indexes
1. Show them explain plan as you go - make them take out index and re-insert index

1. Use Yelp API or open street API to get JSON file of businesses
