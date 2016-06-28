var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

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
  name: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  }
});


userSchema.methods.getFollowers = function (callback){
  var that = this;
  Follow.find({from: this._id}).populate('to').exec(function(err, following) {
    Follow.find({to: that._id}).populate('from').exec(function(err, followers) {
      callback(following, followers);
    });
  });
}

userSchema.methods.follow = function (idToFollow, callback){

  Follow.findOrCreate({from: this._id, to:idToFollow}, function(err) {
    if(err) {
      console.log("error in userSchema.methods.follow: ", err);
    }
  });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findOneAndRemove({from: this._id, to: idToUnfollow}, function(err) {
    if(err) {
      console.log("error in userSchema.methods.unfollow: ", err);
    }
  });
}

userSchema.methods.isFollowing = function(userId) {
  Follow.findById(userId, function(err, user) {
    if(!err) {
      if(user) {
        return true;
      } else {
        return false;
      }
    } else {
      console.log("error in userSchema.methods.isFollowing: ", err);
    }
  });
}

userSchema.methods.getReviews = function(callback) {
  Review.find({user: this._id}).populate('restaurant').exec(function (err, reviews) {
    if(!err) {
      callback(reviews);
    } else {
      console.log("error in userSchema.methods.getReviews: ", err);
    }
  });
}

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
    ref: 'Restaurant',
    required: true
  },
  user: {
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
  price: {
    type: Number,
    required: false
  },
  category: {
    type: String,
    required: false
  },
  latitude: {
    type: Number,
    required: false
  },
  longitude: {
    type: Number,
    required: false
  },
  openTime: {
    type: Number,
    required: false
  },
  closingTime: {
    type: Number,
    required: false
  },
  totalScore: {
    type: Number,
    required: false
  },
  reviewCount: {
    type: Number,
    required: false
  }
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Review.find({restaurant: restaurantId}, function (err, reviews) {
    if(!err) {
      return reviews;
    } else {
      console.log("error in restaurantSchema.methods.getReviews: ", err);
    }
  });
}

restaurantSchema.methods.stars = function(callback){
  return (this.totalScore/this.reviewCount);
}


FollowsSchema.plugin(findOrCreate);
var Follow = mongoose.model('Follow', FollowsSchema);
var Review = mongoose.model('Review', reviewSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
