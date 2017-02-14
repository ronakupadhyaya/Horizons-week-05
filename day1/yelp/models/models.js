var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
// var connect = require('./connect') || process.env.MONGODB_URI;
// mongoose.connect(connect);

mongoose.connect(require('../connect'));

var userSchema = mongoose.Schema({

  displayName: {
    type: String
    // required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  Location: {
    type: String
    // required: true
  }
});

userSchema.methods.getFollows = function (callback){


  Follow
  .find({follower: this._id})
  .populate("follower")
  .exec(function(err, allFollowers){
    if(err){
      callback(err);
    } else{

      Follow
        .find({followee: this._id})
        .populate('followee')
        .exec(function(err, allFollowees) {
          if(err) {
            callback(err);
          } else{
            callback(null, {followers: allFollowers, followees: allFollowees});
          }
          
        });
    }
  });

}

userSchema.methods.follow = function (idToFollow, callback){

  Follow.findOne({followee: idToFollow, follower: this._id}, function(err, follow){

    if(err){
      callback(err);
    }

    if(!follow){

      var newFollow = new Follow({

        follow: this._id,
        followee: idToFollow

      });

      newFollow.save(function(err, follow){

        if(err){
          callback(err);
        } else{
          callback(null, follow);
        }

      });

    }

  });

}

userSchema.methods.unfollow = function (idToUnfollow, callback){

  Follow.findOneAndRemove({follower: this._id, followee: idToUnfollow}, function(err){

    if(err){
      callback(err);
    } else{
      callback(null);
    }
  });
}

userSchema.methods.isFollowing = function (idIsFollowing, callback){

  Follow.find({follower: this._id, followee: idToUnfollow}, function(err, follower){

    if(err) {
      callback(err);
    } else{

      if(!follower) {
        callback(null, false);
      } else{
        callback(null, true);
      }
    }
  });

}

var FollowsSchema = new mongoose.Schema({

  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  followee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: Follow
};
