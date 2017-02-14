var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

//follow schema
var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});
var Follow = mongoose.model('Follow', FollowsSchema);


//user
var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  display: {
    type: String
  },
  location: {
    type: String
  }
});


userSchema.methods.getFollows = function (callback){
  // var allFollowers = [];
  // var allFollowing = [];
  var id = this._id;
  Follow.find({to: id})
  .populate('from')
  .exec(function(err, allFollowers) {
    if (err) {
      throw "fuck err";
    }
    Follow.find({from: id})
    .populate('to')
    .exec(function(err, allFollowing) {
      if (err) {
        throw "fuck err";
      }
      callback(allFollowers, allFollowing);
    })
  })
}


userSchema.methods.follow = function (idToFollow, callback){
  var follow = new Follow({from: this._id, to: idToFollow});
  follow.save(function(err) {
    callback(err);
  });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findAndOne({from: this._id, to: idToUnfollow}, function(err, doc) {
    callback(err);
  });
}

userSchema.methods.isFollowing = function(idFollowing, callback) {
  Follow.findOne({from: this._id, to: idFollowing}, function(err, user) {
    if (err) {
      throw "error"
    }
    user ? callback(true) : callback(false)
  })
}

var User = mongoose.model('User', userSchema);

var reviewSchema = mongoose.Schema({

});
var Review = mongoose.model('Review', reviewSchema);


var restaurantSchema = mongoose.Schema({

});
var Restaurant = mongoose.model('Restaurant', restaurantSchema);

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}


module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
