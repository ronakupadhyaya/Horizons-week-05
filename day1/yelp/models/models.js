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

userSchema.methods.getFollowers = function (id, callback){
  Follow.find({userTo: id}).populate('userFrom').exec(function(err, followers){
    if(followers) {
     Follow.find({userFrom: id}).populate('userTo').exec(function(err, following){
       callback(err, followers, following);
      });
    }
  });
};

userSchema.methods.follow = function(idToFollow, callback){
  var id = this._id;
  Follow.find({userFrom: id, userTo: idToFollow}, function(err, follow){
    // if(err){
    // }
    if(follow.length === 0){
      var newFollow = new Follow({
        userFrom: id, // follower
        userTo: idToFollow // being followed
      });
      newFollow.save(
        function(err, succ){
          callback(err,succ);
      });
    }
  })
}

userSchema.methods.unfollow = function(idToUnfollow, callback){
  Follow.find({userFrom: this._id, userTo: idToUnfollow}).remove(
    function(err, removed){
      callback(err, removed);
  })
}

userSchema.methods.isFollowing = function(id, callback){
  Follow.find({userFrom: this._id, userTo: id}, function(err, following){
    if(following && following.length ===0){
      callback(err, false);
    }
    if(following && following.length >0){
      callback(err, true);
    }
  })
}

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

var Follow = mongoose.model('Follow', FollowsSchema);

var reviewSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    enum:[1,2,3,4,5],
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
    required: true,
    index: true
  },
  category: {
    type: String,
    enum:["Mexican", "Food Stands", "Tex-Mex", "Food Trucks", "Pizza", "Bars", "Italian", "Mediterranean", "Indian", "Grocery"],
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  price: {
    type: Number,
    enum:[1,2,3],
    required: true
  },
  openTime: {
    type: String,
    required: true
  },
  closingTime: {
    type: String,
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  reviewCount: {
    type: Number,
    required:true
  },
  averageRating: {
    type: Number,
    required: true,
    index: true
  }
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){
  this.model('Review').findById({restaurantId:restaurantId}).populate('userId').exec(
    function(err, reviews){
        callback(err, reviews);
  })
}

restaurantSchema.virtual('averageRating').get(function() {
  if(this.reviewCount === 0){
    return "Not Rated Yet";}
  return parseInt(this.totalScore/this.reviewCount);
});



module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)

  // DO WE NEED TO MAKE A SEPARATE PERSON
  // Person: mongoose.m
};
