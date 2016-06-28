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

var FollowSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

userSchema.methods.getFollowers = function (id, callback){
  var that = this
  Follow.find({
    from: this._id
  }).populate('to')
  .exec(function(error, usersImFollowing) {
    Follow.find({
      to: that._id
    }).populate('from')
    .exec(function(error, usersWhoFollowMe) {
      callaback(usersImFollowing, usersWhoFollowMe)
    })
  })
  // Follow.find({userTo: this._id}, function(err, followers) {
  //   Follow.find({userFrom: this._id}, function(err, following) {
  //     callback(followers, following);
  //   })
  // })
}

userSchema.methods.follow = function (idToFollow, callback){
  var f = new Follow({
    from: this._id,
    to: idToFollow
  }).save(callback)
  // Follow.find({userTo: idToFollow}, function(err, follows) {
  //   if (follows){
  //     callback(null);
  //   } else {
  //     var follow = new Follow({
  //       from: this._id,
  //       to: idToFollow
  //     }).save(function(err, follow) {
  //       if (err) return console.log(err);
  //       callback(follow);
  //     })
  //   }
  // })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findOneAndRemove({userTo: idToUnfollow}, function(err, unfollow) {
    if (err) return console.log(err);
    if (!unfollow) {
      console.log("No one to unfollow");
    } else {
      callback(unfollow);
    }
  })
}

userSchema.methods.isFollowing = function (id, callback){
  Follow.find({from: this._id, to: id}, function (err, follows) {
    if (follows) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  })
}

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

restaurantSchema.methods.stars = function(callback){

}

var Follow = mongoose.model("follow", FollowSchema);

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: Follow
};
