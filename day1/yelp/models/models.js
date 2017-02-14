var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String,
    //required: true
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
    //required: true
  }
});

userSchema.methods.getFollows = function (callback){
  var data = {};
  var user = this;
  Follow.find({to: user._id})
  .populate('from')
  .exec(function(err, followers) {
    if (err) {
      console.log(err);
    } else {

      Follow.find({from: user._id})
      .populate('to')
      .exec(function(err, following) {
        if (err) {
          console.log(err);
        } else {
          console.log('FOLLOWERS: ', followers);
          console.log('FOLLOWING: ', following);
          data.allFollowers = followers;
          data.allFollowing = following;
          callback(data);
        }
      });
    }
  });
}
userSchema.methods.follow = function (idToFollow, callback){
  var newFollow = new Follow({from: this._id, to: idToFollow});
  newFollow.save(function(err, saved) {
    if (err) {
      console.log(err);
    } else {
      callback(saved);
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({fromId: this._id, toId: idToUnfollow}, function(err, follow) {
    if (err) {
      console.log(err);
    } else {
      callback(null, follow);
    }
  });
}

userSchema.methods.isFollowing = function (id, callback){

}

var FollowsSchema = mongoose.Schema({
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

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}
var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  Follow: Follow,
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema)

};
