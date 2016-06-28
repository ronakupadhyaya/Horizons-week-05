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
    // required: true
  },
  location: {
    type: String,
    // required: true
  }
});


// userSchema.methods.getFollowers = function (callback){
//   this.model('Follow').find({userTo : this._id})
//   .populate('userFrom')
//     .exec(function(err, allFollowing){
//       console.log("He " + allFollowing);
//       this.model('Follow').find({userFrom : this._id })
//       .populate('userTo')
//       .exec(function(err, allFollowers){
//         callback(err, allFollowing, allFollowers)
//       })
//     )}.bind(this)
//   )
// }

userSchema.methods.getFollows = function (callback){
  var that = this;
  Follow.find({
    from: this._id
  }).populate('to') //this is the following
  .exec(function(error, allFollowing) {
    if(error) return callback(error);
    Follow.find({
      to: that._id
    }).populate('from')
    .exec(function(error, allFollowers) {
      // console.log("DARWISH", allFollowing)
      // console.log("DARWISH 2", allFollowers)
      callback(error, allFollowing, allFollowers);
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
  Follow.remove({to : idToUnfollow}, function(err, unfollow){
    if(err) return console.log(err);
    if(!unfollow){
      console.log("No user to unfollow!");
    }else{
      callback(null, unfollow);
    }
  })
}

userSchema.methods.isFollowing = function(id, callback){
  Follow.findOne({to : id}, function(err, follows){
    if(!follows){
      callback(false);
    }else{
      callback(true);
    }
  })
}

userSchema.methods.getReviews = function (userId, callback){
  Review.find({user: userId}).populate('restaurant')
  .exec(function(error, allReviews) {
    console.log(allReviews);
    callback(error, allReviews);
  });
}

var FollowsSchema = mongoose.Schema({
  //the id of the user that follows
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  //the id of the user being followed
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({
  stars: {type: Number, enum: [1,2,3,4,5]},
  content: String,
  restaurant: {type: mongoose.Schema.ObjectId, ref: 'Restaurant'},
  user: { type: mongoose.Schema.ObjectId, ref: 'User'}
});

// reviewSchema.methods.stars = function(callback){
//     callback(stars)
// }

var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["Korean", "Italian", "Chinese", "Mexican", "BYO"]
  },
  location:{
    latitude: Number,
    longitude: Number,
  },
  price:{
    type: Number,
    enum: [1,2,3],
    required: true
  },
  openTime:{
    type: Number,
    required: true
  },
  closingTime:{
    type: Number,
    required: true
  },
  address: String,
  totalScore: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Review.find({restaurant: restaurantId}).populate('user')
  .exec(function(error, allReviews) {
    console.log(allReviews);
    callback(error, allReviews);
  });
};

restaurantSchema.virtual('averageRating').get(function () {
  return this.totalScore / this.reviewCount;
});

restaurantSchema.methods.stars = function(callback){
    //return the Number
    callback(this.averageRating)
}

var Follow = mongoose.model('Follow', FollowsSchema);
var Review = mongoose.model('Review', reviewSchema);

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: Review,
  Follow: Follow
};
