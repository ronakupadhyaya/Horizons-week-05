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

userSchema.methods.getFollows = function (callback){
  var that = this;
  Follow.find({
    from: this._id
  }).populate('to')
  .exec(function(error, usersImFollowing) {
    Follow.find({
      to: that._id
    }).populate('from')
    .exec(function(error, usersWhoFollowMe) {
      console.log(usersWhoFollowMe)
      callback(usersImFollowing, usersWhoFollowMe);
    });
  });
}

userSchema.methods.follow = function (idToFollow, callback){
    this.model('Follow').find({follower: this._id, following: idToFollow}, function(err, follow){
      if(!follow){
        var newfollow = new this.model('Follow')({
          follower: this._id,
          following: idToFollow
        });
        newfollow.save(function(err){
          callback(err);
        });
      }
    });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.find({
    follower: this._id, following: idToUnfollow}, function(err, follow){
      if(follow){
        follow.remove(callback(err));
      }
  });
}

userSchema.methods.isFollowing = function (idToCheck, callback){
  this.model('Follow').find({follower: this._id, following: idToCheck}, function(err, follow)){
    if(follow){
      callback(true);
    }else{
      callback(err);
    }
  });
});

var FollowsSchema = mongoose.Schema({
  follower: {
    id: mongoose.Schema.ObjectId,
    ref: "User"
  },
  following: {
    id: mongoose.Schema.ObjectId,
    ref: "User"
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
    id: mongoose.Schema.ObjectId,
    ref: 'Restaurant'
  },
  user: {
    id: mongoose.Schema.ObjectId,
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
  latitude : {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  openTime : {
    type: Number,
    required: true
  },
  closingTime : {
    type: Number,
    required: true
  },
  totalScore : {
    type: Number,
    required: true
  },
  reviewCount : {
    type: Number,
    required: true
  }
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){
  this.model('Review').find({restaurant: restaurantId}, function(err, review){
    if(review){
      callback(review);
    }else{
      callback(err);
    }
  });
}

restaurantSchema.methods.averageReview = function(id, callback){
  Restaurant.find({id: this._id}, function(err, restaurant){
    if(err){
      callback(err);
    }else{
      callback(totalScore/reviewCount);
    }
  });
}



module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
