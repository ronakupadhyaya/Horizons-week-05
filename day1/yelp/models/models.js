var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  name: {
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

userSchema.methods.getFollowers = function (id, callback){
  this.model('Follow').find({userTo: id}).populate('userFrom').exec(function(error, followers) {
    Follow.find({userFrom: id}).populate('userTo').exec(function(error, following) {
      callback(followers, following);
    });
  });
}

userSchema.methods.follow = function (idToFollow, callback){
  this.model('Follow').find({userFrom: this._id, userTo: idToFollow}, function(error, follow) {
    if (err) {
      var newFollow = new this.model('Follow')({
        userFrom: this._id, // follower
        userTo: idToFollow // being followed
      });
      newFollow.save(function(err, succ) {
        callback(err, succ)
      }) 
    }
  });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  this.model('Follow').find({userFrom: this._id, userTo: idToUnfollow}).remove(function(err, removed) {
    callback(err, removed);
  });
};

userSchema.methods.isFollowing = function(id, callback) {
  this.model('Follow').find({userFrom: this._id, userTo: id}, function(err, following) {
    callback(err, following);
  })
};

var FollowsSchema = mongoose.Schema({
  userFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

var reviewSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});


var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
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

}

restaurantSchema.methods.averageRating = function(callback){

}


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
