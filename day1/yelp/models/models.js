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

userSchema.statics.getFollows = function (id, callback){
  Follow.find({ from: id }).populate('to').exec(function(err, allFollowing) {
    Follow.find({ to: id }).populate('from').exec(function(err, allFollowers){
      callback(err, allFollowing, allFollowers);
    })
  })
}
userSchema.methods.follow = function (idToFollow, callback){
  var that = this;
  User.findById(idToFollow, function(err, toUser) {
    Follow.find({ from: this, to: toUser })
    .exec(function(err, follows) {
      if (err) return next(err);
      if (follows.length <= 0) {
          if (err) return next(err);
          var follow = new Follow ({
          from: that,
          to: toUser
          })
          console.log(follow);
          follow.save(callback);
      } else {
        callback(null)
      }
    })
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findOneAndRemove({ from: this._id, to: idToUnfollow }).exec(function (err) {
      callback(err)
  });
}

userSchema.methods.isFollowing = function(idToCheck, callback) {
  Follow.find({ from: this._id, to: idToCheck }).exec(function (err, follows) {
    if (err) return next(err);
    if (follows.length >= 1) {
      callback(true);
    } else if (follows.length <= 0) {
      callback(false);
    } else {
      console.log("isFollowing Error")
      callback(null)
    }
  });
}

var followSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  //user being followed
  to: {
    type: mongoose.Schema.ObjectId,
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

var User = mongoose.model('User', userSchema);
var Follow = mongoose.model('Follow', followSchema);


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', followSchema)
};
