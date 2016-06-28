var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String,
    requred: true
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


userSchema.methods.getFollowers = function (id, callback) {
return this.model('Follow').find({
    followed: id
  })
  .populate('follower')
  .exec(function(err, myFollowers) {
      Follow.find({
        follower: id
        })
        .populate('followed')
        .exec(function(err, myFollowed){

          callback(err, myFollowers, myFollowed)
        })}
        )
};

userSchema.methods.follow = function (idToFollow, callback) {
  this.model('Follow').findOne({
    follower: this._id,
    followed: idToFollow
  }, function(err, pair) {
    if (! err && pair === null) {
        var n = new Follow({
          follower: this._id,
          followed: idToFollow
        })
        n.save(function(error) {
          if(error) {
            callback(error);
          }
          callback(n);
        });
    } else if (err) {
      callback(err);
    } else {
      callback(pair);
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  this.model('Follow').findOne({
    follower: this._id,
    followed: idToUnfollow
  }, function(err, pair) {
    if(err) {
      callback(err);
    }
    pair.remove(function(error, deleted) {
      if(error) {
        callback(error);
      } else {
        callback(deleted)
      }
    })
  })
}

userSchema.methods.isFollowing = function(isFollowing, callback) {
  this.model('Follow').findOne({
    follower: this._id,
    followed: isFollowing
  }, function(err, pair) {
    if (err) {
      callback(err)
    } else {callback (pair === null)}
  })
}

var FollowsSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  followed: {
    type: mongoose.Schema.Types.ObjectId,
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
    enum: ["Korean", "Italian", "Chinese", "Mexican", "BYO"],
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  price: {
    type: Number,
    enum: [1, 2, 3],
    required: true
  },
  openTime: {
    type: String,
    required: true
  },
  closingTime: {
    type: String,
    required: true
  }

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}




module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
