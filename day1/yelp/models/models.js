var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('../connect').MONGODB_URI;
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  location: {
    type: String
  }
  // reviews: [{
  //   type: mongoose.Schema.Types.objectId,
  //   ref: 'Review'
  // }]
});

var followSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  name: String,
  category: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  openTime: Number,
  closingTime: Number
});

userSchema.methods.getFollows = function (callback){
  var me = this._id;
  Follow.find({from: me}).populate('to').exec(function(err, followingArray) {
    if(err) {
      callback(err);
    } else {
      Follow.find({to: me}).populate('from').exec(function(err, followersArray) {
        if(err) {
          callback(err);
        } else {
          callback(null, {followers:followersArray, following:followingArray});
        }
      })
    }
  })
}

userSchema.methods.follow = function (idToFollow, callback){
  var follower = this._id;
  Follow.findOne({from: follower, to: idToFollow}, function(err, found) {
    if(err) {
      callback(err);
    } else if(found) {
      callback(null, found);
    } else {
      var follow = new Follow ({
        from: follower,
        to: idToFollow
      })
      console.log(follow);
      follow.save(function(err) {
        if(err) {
          callback(err);
        } else {
          callback(null, follow);
        }
      })
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var me = this._id;
  Follow.findOne({from: me, to: idToUnfollow}, function(err, found) {
    console.log(found);
    console.log(me);
    if(err) {
      callback(err);
    } else if(!found) {
      callback({error: "You already don't follow this person!"})
    } else {
      found.remove(function(err) {
        if(err) {
          callback(err);
        } else {
          callback(null, found);
        }
      })
    }
  })
}

userSchema.methods.isFollowing = function (idToCheck, callback){
  var me = this._id;
  Follow.findOne({from: me, to: idToCheck}, function(err, found) {
    if(err) {
      callback(err);
    } else {
      callback(null, !!found);
    }
  })
}

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var Follow = mongoose.model('Follow', followSchema);
var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
