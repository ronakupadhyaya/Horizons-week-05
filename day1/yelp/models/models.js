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
    type: String
  },
  location: {
    type: String,
    required: true
  }
});

userSchema.methods.getFollows = function (callback){
  var that = this;
  Follow.find({
    from: this._id
  }).populate('to')
  .exec(function(error, usersImFollowing){
      Follow.find({
    to: that._id
    }).populate('from')
   .exec(function(error, usersWhoFollowMe){
    callback(usersImFollowing,usersWhoFollowMe);
   });
  });

  // Follow.find({
  //   from: this._id
  // }, function(err, usersImFollowing) {
  //     callback(usersImFollowing)
  // }) 
}

// userSchema.methods.follow = function (idToFollow, callback){
//   var newFollow = new this.model('Follow')({
//     from: idToFollow,
//     to: this._id
//   });
//   newFollow.save(function(err){
//     if (!err) {
//       callback(followers)
//     } else {
//       console.log("Error")
//     }
//   });
// }

// userSchema.methods.unfollow = function (idToUnfollow, callback){
//   this.model('Follow').findOneAndRemove({
//     from: idToFollow,
//     to: this._id
//   }, function(err){
//     if (err) {
//       console.log("Error");
//     }
//   })
// }

// userSchema.statics.follow = function (uid1, uid2, callback){
//   Follow.find({uid1:uid1, uid2: uid2}, function(err, follows) {
//     if (err) return next(err);
//     if (follows.length<=0){
//       var follow = new this.model('Follow')({
//         from: idToFollow,
//         to: this._id
//       });
//       follow.save(function(err) {
//         callback(err)
//       })
//     }
//     else {
//       callback(null);
//     }
//   });
// }

userSchema.methods.follow = function(idToFollow, callback){
 new Follow({
  from: this._id,
  to: idToFollow
 }).save(callback);

}

userSchema.statics.unfollow = function (uid1, uid2, callback){
    Follow.find({uid1:uid1, uid2: uid2}).remove(function(err) {
    callback(err)
  })
}

userSchema.methods.isFollowing = function(userId) {
  Follow.findById(userId, function(err, user) {
    if (!err) {
      if (user) {
        return true
      } else {
        return false
      }
    } else {
      console.log("Error");
    }
  })
}

userSchema.methods.getReviews = function(callback) {
  Review.find({
    user: this._id
  }, function(err, reviews){
    if (err) {
      console.log("Error")
    } else {
      return reviews;
    }
  })
}

//Object ID thing because this is a foreign key
//Make sure, then, to have a ref. Refs to User. 
//Why? Bc that's the schema we're getting from and to from.
var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

var reviewSchema = mongoose.Schema({
  stars: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    //Ref from bottom of page
    ref: 'Restaurant'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }

});


var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ["Korean", "Italian", "Chinese", "Mexican", "Other"],
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number
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
  Review.find(
  {
    restaurant: restaurant._id
  }, function(err, reviews) {
    if (err) {
      console.log("Error")
    } else {
      return reviews;
    }
  })
}

restaurantSchema.methods.stars = function(callback){
  return (this.totalScore / this.reviewCount);
}

var User = mongoose.model('User', userSchema);
var Follow = mongoose.model('Follow', FollowsSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema)

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
