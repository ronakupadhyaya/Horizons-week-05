var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect)


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

userSchema.methods.getFollowers = function (callback){
  var that = this
  this.model('Follow').find({
    user2: this._id
  }).populate('user1').exec(function(error1, allFollowers) {
    if(error1) {
      callback(error1);
      return;
    }
    that.model('Follow').find({
      user1: that._id
    }).populate('user2').exec(function(error2, allFollowing) {
      if(error2) {
        callback(error2);
        return;
      }
      callback(null, allFollowers, allFollowing);
    });
  })
}
userSchema.methods.follow = function (idToFollow, callback){
  var that = this
  this.model('Follow').findOne({
    user1: this._id,
    user2: idToFollow
  }, function(err, follows) {
    if(follows) {
      callback(err, null);
      return;
    }
    var f = that.model('Follow')({ 
      user1: that._id,
      user2: idToFollow
    }).save(callback);
  });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
    this.model('Follow').remove({
    user1: this._id,
    user2: idToUnfollow
  }, callback);
}

var FollowsSchema = mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
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
    requried: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});


var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
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
    type: String,
    required: true
  },
  opentime: {
    type: Number,
    required: true
  },
  closetime: {
    type: Number,
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  reviewCount: {
    type: Number,
    required: true
  }
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){
  this.model('Review').find({
    restaurantId: restaurantId
  }).populate('userId').exec(function(error, reviews) {
    if (error) {
      callback(error);
      return
    }
    callback(null, reviews);
  })
}

restaurantSchema.methods.stars = function(callback){

}


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
