var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
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
    type: String
  }
});

userSchema.methods.getFollows = function(cb) {
  this.model('Follow').find({
      "$or": [{
        from: this._id
      }, {
        to: this._id
      }]
    })
    .populate('from to')
    .exec(function(error, follows) {
      var followers = [];
      var following = [];
      for (var i in follows) {
        if (String(follows[i].from._id) === String(this._id)) {
          following.push(follows[i]);
        } else {
          followers.push(follows[i]);
        }
      }
      cb(error, followers, following);
    });
}

userSchema.methods.follow = function(idToFollow, cb) {
  this.model('Follow').find({
    from: this._id,
    to: idToFollow
  }, function(err, follows) {
    if (follows.length < 1) {
      var follow = new Follow({
        from: this._id,
        to: idToFollow
      });
      follow.save(cb)
    } else {
      cb(null);
    }
  });
}

userSchema.methods.unfollow = function(idToUnfollow, cb) {
  this.model('Follow').find({
    from: this._id,
    to: idToUnfollow
  }).remove(function(err) {
    cb(err);
  })
}

userSchema.methods.isFollowing = function(user, cb) {
  this.model('Follow').find({
    from: this._id,
    to: user
  }, function(err, follows) {
    if (follows.length < 1) {
      cb(false);
    } else {
      cb(true);
    }
  })
}

var followSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  name: {
    type: String
  },
  category: {
    type: String
  },
  latitude: Number,
  longitude: Number,
  price: Number,
  openTime: Number,
  closingTime: Number
});

restaurantSchema.methods.getReviews = function(restaurantId, cb) {

}

//restaurantSchema.methods.stars = function(cb){
//
//}


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', followSchema)
};
