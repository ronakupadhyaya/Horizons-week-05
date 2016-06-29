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
var that = this;
return this.model('Follow').find({
    followed: id
  })
  .populate('follower')
  .exec(function(err, myFollowers) {
      that.model('Follow').find({
        follower: id
        })
        .populate('followed')
        .exec(function(err, myFollowed){

          callback(err, myFollowers, myFollowed)
        })}
        )
};

userSchema.methods.follow = function (idToFollow, callback) {
  var myId = this._id;
  this.model('Follow').findOne({
    follower: this._id,
    followed: idToFollow
  }, function(err, pair) {
    if (! err && pair === null) {
        var n = new Follow({
          follower: myId,
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
      callback(err, pair);
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
        callback(err, deleted)
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
    } else {callback (err, pair !== null)}
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
    required: true,
    index: {
      unique: true
    }
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

restaurantSchema.statics.getTen = function(n, callback) {
    var page = parseInt(n);
    Restaurant.find()
    .sort({'name': 1})
    .limit(6)
    .skip(5 * (page - 1))
    .exec(function(err, restaurants) {
      var displayRest = restaurants.slice(0,5);
      callback(displayRest, page > 1, page + 1, page - 1, restaurants.length === 6)
    });
}






restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

  var User = mongoose.model('User', userSchema);
  var Restaurant = mongoose.model('Restaurant', restaurantSchema);
  var Review = mongoose.model('Review', reviewSchema);
  var Follow = mongoose.model('Follow', FollowsSchema);


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
