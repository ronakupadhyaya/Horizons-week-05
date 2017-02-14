var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('../connect');
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
    type: String,
    required: true
  }
});

var User = mongoose.model('User', userSchema);

var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }, 
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
})

// userSchema.methods.getFollows = function (id, callback){
//   Follow.find({from: this._id}, function(err, follow){
//     if(follow){
//       Follow.find({to: id}, function(err, followee){
//         if(followee){
//           // var obj = {
//           //   follow: follow,
//           //   followee: followee
//           // }
//           callback(null,follow,followee);
//         }  else {
//             callback(err);
//         }
//       })
//     }
//   });
// }
userSchema.methods.getFollows = function(callback){
  Follow
    .find({from: this._id})
    .populate('from')
    .exec(function(err,allFollowers){
      Follow
        .find({to: this._id})
        .populate('to')
        .exec(function(err, allFollowing){
          callback(null, allFollowers, allFollowing);
    });
});
}
userSchema.methods.follow = function (idToFollow, callback){
  var user1 = this._id;
  var user2 = idToFollow;
  Follow.findOne({from:user1, to: user2}, function(err,follow){
    if(follow){
      callback(err);
    } else {
      var follow = new Follow({
        from: user1,
        to: user2
      })
      follow.save(callback);
    }
  });

}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var user1 = this._id;
  var user2 = idToUnfollow;
  Follow.findById({from: user1, to: user2}, function(err,follow){
    if(follow){
      follow.remove(callback);
    }
  })
}

userSchema.methods.isFollowing = function (idIsfollowing, callback){
  var user1 = this._id;
  var user2 = idIsfollowing;
  Follow.findOne({from: user1, to: user2}, function(err,follow){
    callback(null, !!follow); // This is truthy
  })
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
  Follow: mongoose.model('Follow', FollowsSchema)
};
