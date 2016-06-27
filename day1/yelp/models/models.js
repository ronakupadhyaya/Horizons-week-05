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
    // required: true
  },
  location: {
    type: String,
    // required: true
  }
});


// userSchema.methods.getFollowers = function (callback){
//   this.model('Follow').find({userTo : this._id})
//   .populate('userFrom')
//     .exec(function(err, allFollowing){
//       console.log("He " + allFollowing);
//       this.model('Follow').find({userFrom : this._id })
//       .populate('userTo')
//       .exec(function(err, allFollowers){
//         callback(err, allFollowing, allFollowers)
//       })
//     )}.bind(this)
//   )
// }

userSchema.methods.getFollows = function (callback){
  var that = this;
  Follow.find({
    from: this._id
  }).populate('to')
  .exec(function(error, allFollowing) {
    Follow.find({
      to: that._id
    }).populate('from')
    .exec(function(error, allFollowers) {
      console.log(allFollowers)
      callback(allFollowing, allFollowers);
    });
  });
}

  //   Follow.find({
  //     from: this._id
  //   }, function(err, allFollowing) {
  //     callback(allFollowing)
  //   });
  // };

//   this.model('Follow').find({
//     to: this._id
//   })
//     .populate('from')
//     .exec(function(err, allFollowing){
//       console.log("He " + allFollowing);
//       this.model('Follow').find({
//         from: this._id
//       })
//         .populate('to')
//         .exec(function(err, allFollowers){
//           callback(err, allFollowing, allFollowers)
//       });
//     }.bind(this)
//   )
// }


userSchema.methods.follow = function (idToFollow, callback){
  new Follow({
    from: this._id,
    to: idToFollow
  }).save(callback);
  // Follow.find({userTo : idToFollow}, function(err, follows){
  //   if(!follows){
  //     callback(null);
  //   }else{
  //     var f = new Follow({
  //       from: this._id,
  //       to: idToFollow
  //     }).save(function(err, follow){
  //       if(err) return console.log(err);
  //       callback(follow);
  //     })
  //   }
  // });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findOneAndRemove({to : idToUnfollow}, function(err, unfollow){
    if(err) return console.log(err);
    if(!unfollow){
      console.log("No user to unfollow!");
    }else{
      callback(unfollow);
    }
  })
}

userSchema.methods.isFollowing = function(following, callback){
  Follow.find({to : idToFollow}, function(err, follows){
    if(!follows){
      return false;
    }else{
      return true;
    }
  })
}

var FollowsSchema = mongoose.Schema({
  //the id of the user that follows
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  //the id of the user being followed
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

restaurantSchema.methods.stars = function(callback){

}


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
