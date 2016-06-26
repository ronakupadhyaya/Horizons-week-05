var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  displayName: String,
  username: String,
  password: String, //Hashed
  address: String, //descriptive location
  reviews: [] //review ids
  //TODO: Status (display user status if Elite)
  // TODO: Location (only text, descriptive location)

  //get reviews()
});

//Instance method
userSchema.methods.getFollowers = function (user, callback){
  // Find Following
  Follow.find({uid1: user.id}).populate('uid2').exec(function(err, following) {
    //Find Followers
    Follow.find({uid2: user.id}).populate('uid1').exec(function(err, followers) {
      callback(err, followers, following);
    });
  });
}
userSchema.methods.follow = function (followId, callback){
  // TODO: Check duplicates before following
  var follow = new Follow({
    uid1: this.id,
    uid2: followId
  });
  follow.save(function(err) {
    callback(err)
  })
}

// TODO: user.Unfollow
// TODO: user.verifyPassword (virtual field)


var User = mongoose.model('User', userSchema);


var FollowsSchema = mongoose.Schema({
  uid1 : { type: mongoose.Schema.ObjectId, ref: 'User' },
  uid2 : { type: mongoose.Schema.ObjectId, ref: 'User' },
});
var Follow = mongoose.model('Follow', FollowsSchema)

var reviewSchema = mongoose.Schema({
  stars: Number, // 1 -> 5
  content: String,
  restaurant: { type: mongoose.Schema.ObjectId, ref: 'Restaurant' },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});
var Review = mongoose.model('Review', reviewSchema);


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
  // getUsersReviewed
});
restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Review.find( {restaurant: restaurantId }).populate('user').exec( function(err, restaurants) {
    callback(err, restaurants);
  });
}

var Restaurant = mongoose.model('Restaurant', restaurantSchema);


module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
