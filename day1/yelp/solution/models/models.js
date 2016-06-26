var mongoose = require('mongoose');
//var connect = process.env.MONGODB_URI || require('./connect');
//mongoose.connect(connect);

// Step 1: Create and edit contacts
// Remember: schemas are like your blueprint, and models
// are like your building!

var userSchema = mongoose.Schema({
  displayName: String,
  username: String,
  password: String, //Hashed
  address: String, //descriptive location
  reviews: [] //review ids
  //get reviews()
  //  friends
});

var restaurantSchema = mongoose.Schema({
  name: String,
  price: Number, //scale of price 1->3
  reviews: [], //review ids
  // virstual stars, from reviews array
  latitude: Number,
  longitude: Number,
  category: String, //enum
  openHoursEST: {
    openTime: Number,
    closingTime: Number
  }
  // getReviews()
  // getUsersReviewed
});
var reviewSchema = mongoose.Schema({
  stars: Number, // 1 -> 5
  content: String,
//  Restaurant (mongoose.Schema.Types.ObjectId of Restaurant)
//  User (mongoose.Schema.Types.ObjectId of User)
});

/*
var Friendship = mongoose.Schema({

});
*/

module.exports = {
    User: mongoose.model('User', userSchema),
    Restaurant: mongoose.model('Restaurant', restaurantSchema),
    Review: mongoose.model('Review', reviewSchema)
};
