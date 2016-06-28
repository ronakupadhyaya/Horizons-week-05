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
  }
});

var followSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// userSchema.methods.getFollows = function (id, callback){


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
  new Follow({
    from: this._id,
    to: idToFollow
  }).save(callback);
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({from: this._id, to: idToUnfollow}, callback)
}

var reviewSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    enum: ["1","2","3","4","5"],
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  }
});

// reviewSchema.virtual('totalRating').get(function () {
//   return this.Stars.reduce(function (prev, cur) {
//     return prev + cur.contributionAmount;
//   }, 0);
// })

// reviewSchema.virtual('rating').get(function () {
//   var rating = this.totalRating;
//   return rating/5;
// })

var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["Korean", "Italian", "Chinese", "Mexican", "BYO", "Seafood"],
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  price: {
    type: Number,
    enum: ["1","2","3","4"],
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
    required: true
  }
});

restaurantSchema.virtual('rating').get(function () {
  if(this.reviewCount === 0) {
    return "Not Rated Yet";
  }
  return parseInt(this.totalScore/this.reviewCount);
})

restaurantSchema.virtual('relativePrice').get(function () {
  if (this.price === 1) {
    return "$"
  } else if (this.price === 2) {
    return "$$"
  } else if (this.price === 3) {
    return "$$$"
  } else if (this.price === 4) {
    return "$$$$"
  }
})

restaurantSchema.statics.getTen = function (pageNum, callback) {
  var page = parseInt(pageNum);
  Restaurant.find()
  .limit(10)
  .skip(10*(page-1)).exec(function(error, restaurant) {
    callback(restaurant);
  })
}


restaurantSchema.methods.getReviews = function (callback){
  var that = this;
  Review.find({restaurantId: this._id}).populate('userId')
  .exec(function(error, review) {
    callback(review)
  })
}



//restaurantSchema.methods.stars = function(callback){
//
//}

var Follow = mongoose.model('Follow', followSchema);
var Review = mongoose.model('Review', reviewSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};