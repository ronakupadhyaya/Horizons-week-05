var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

userSchema.methods.getFollows = function (id, callback){

}
userSchema.methods.follow = function (idToFollow, callback){

}

userSchema.methods.unfollow = function (idToUnfollow, callback){

}

var FollowsSchema = new mongoose.Schema({
    user1: {
      type: mongoose.Schema.Types.objectId,
      ref: "User"
      }
    user2: {
      type: mongoose.Schema.Types.objectId,
      ref: "User"
      }
});

var reviewSchema = new mongoose.Schema({

});


var restaurantSchema = new mongoose.Schema({

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
