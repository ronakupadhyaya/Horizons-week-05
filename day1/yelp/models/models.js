var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

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
  },
  reviews: [{
    name: String,
    review: String
  }]
});


userSchema.methods.getFollowers = function (callback){

  // Follow.find({to: this._id}, function(err, followers){
  //   Follow.find({from: this._id}, function(err, following){
  //     callback(followers, following)
  //   })
  // })

  var followers = [];
  var following = [];
  var that = this

  Follow.find({
    $or: [
    {from: this._id},
    {to: this._id}]
  })
  .populate('from to')
  .exec(function(err, follows) {
    for (var i = 0; i < follows.length; i ++) {
      if (follows[i].from._id.equals(that._id)) {
        following.push(follows[i]);
      } else {
        followers.push(follows[i]);
      }
    }
    callback(followers, following);
    console.log(following)
  })
}

userSchema.methods.follow = function (idToFollow, callback){
  var that = this;
  Follow.findOne({to: idToFollow, from: that._id}, function(error, follow) {
    if (follow) {
      callback("already following!");
    } else {
      var f = new Follow({
        from: that._id,
        to: idToFollow
      });
      f.save(function(error,follow) {
        if (error) {
          console.log('error line 64ish models.js');
          callback(error);
        } else {
          callback(null, follow);
        }
      })
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({from:this._id, to: idToUnfollow}, callback)
}

userSchema.methods.isFollowing = function(id, callback) {
  Follow.find({from:this._id, to: id}, function(error, follow) {
    if (follow) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  })
}

userSchema.methods.getReviews = function (callback){
  Review.find({user: this._id}).populate('restaurant').exec(function(error, reviews) {callback(reviews)})
}

var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

var Follow = mongoose.model("Follow", FollowsSchema);

var reviewSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
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


var Review = mongoose.model("Review", reviewSchema);


var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ["Mexican", "Food Stands", "Tex-Mex", "Food Trucks", "Pizza", "Bars", "Italian", "Mediterranean", "Indian", "Grocery"]
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  price: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true
  },
  openTime: {
    type: Number,
    required: true
  },
  closingTime: {
    type: Number,
    required: true
  },
  totalScore: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    required: true,
    index: true
  }
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Review.find({restaurant: restaurantId}).populate('user').exec(function(error, reviews) {callback(reviews)})
}

// restaurantSchema.virtual('averageRating').get(function() {
//   return this.totalScore / this.reviewCount;
// })



//restaurantSchema.methods.stars = function(callback){
//
//}


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
