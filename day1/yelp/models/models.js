var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
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
    type: String,
    required: true
  }
});

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


userSchema.methods.getFollows = function (callback){
  Follow.find({from: this._id})
    .populate('from')
    .exec(function(err, allfollowers){
      Follow.find({to: this._id})
      .populate('to')
      .exec(function(err, followees){
        callback(err, allfollowers, allfollowees);
      });
    });
}
userSchema.methods.follow = function (idToFollow, callback){
  Follow.find({from: this._id, to: idToFollow}, function(err, follow){
    if(err){
      callback(err);
    } else{
      if (follow){
        callback(err, true);
      } else {
        var follow = new Follow({
          from: this._id,
          to: idToFollow
        });
        follow.save(function(err){
          if(err){
            callback(err)
          }
          else{
            callback(err, true);
          }
        });
      }
    }
  });
}

userSchema.methods.isFollowing = function(userId, callback){
  
}

userSchema.methods.unfollow = function(idToUnfollow, callback){
  Follow.findById({from: this._id, to: idToUnfollow._id}).remove(function(err){
    callback(err);
  });
}



var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

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
  Follow: Follow
};
