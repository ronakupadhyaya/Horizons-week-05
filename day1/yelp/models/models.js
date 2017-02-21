var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
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
    type: String
  }
});

userSchema.methods.getFollows = function (id, callback){
  Follow.find({userId1: id}).populate('userId2').exec(function(err, allFollowing) {
    if (err) callback(err);
    Follow.find({userId2: id}).populate('userId1').exec(function(err, allFollowers) {
      if (err) callback(err);
      callback(err, allFollowers, allFollowing);
    });
  });
  // Follow.find({userId1: id}, function(err, allFollowers) {
  //   if (err) callback(err);
  //   Follow.find({userId2: id}, function(err, allFollowing) {
  //     if (err) callback(err);
  //     callback(err, allFollowers, allFollowing);
  //   });
  // });
};

userSchema.methods.follow = function (idToFollow, callback){
  var currentUserId = this._id;
  Follow.findOne({userId1: currentUserId, userId2: idToFollow}, function(err, follows) {
    if (err) callback(err);
    if (!follows) {
      var newFollow = new Follow({
        userId1: currentUserId,
        userId2: idToFollow
      })
      newFollow.save(function(err) {
        if (err) callback(err);
        callback(null);
      });
    } else {
      callback(null)
    }
  });
};

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var currentUserId = this._id;
  Follow.findOne({userId1: currentUserId, userId2: idToUnfollow}).remove(function(err) {
    if (err) callback(err);
    callback(null);
  });
};

userSchema.methods.isFollowing = function (userId, callback){
  var currentUserId = this._id;
  Follow.findOne({userId1: currentUserId, userID2: userId}, function(err, follows) {
    if (err) callback(err);
    if (!follows) {
      callback(false);
    } else {
      callback(true);
    }
  })
};

var FollowsSchema = mongoose.Schema({
  userId1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userId2: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  openTime: {
    type: Number,
    required: true
  },
  closingTime: {
    type: Number,
    required: true
  }
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
