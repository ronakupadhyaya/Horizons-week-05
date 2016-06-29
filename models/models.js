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
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});


userSchema.methods.getFollowers = function (callback){
  var that = this;
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
  });
}

userSchema.methods.follow = function (idToFollow, callback){
  //only follow if not already following
  //this._id
  var that = this;
  this.model('Follow').findOne({
    user1: this._id,
    user2: idToFollow
  }, function(err, follow) {
    if(follow) {
      // callback("Already following!", null);
      callback(err, null);
      console.log(follow);
      return;
    }
    console.log(that);
    var f = that.model('Follow')({ 
      user1: that._id,
      user2: idToFollow
    }).save(callback);
  });

}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  //only unfollow if following in the first place
    this.model('Follow').remove({
    user1: this._id,
    user2: idToUnfollow
  }, callback);
}

var FollowSchema = mongoose.Schema({
  //user1 follows user2
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
    ref: "Restaurant"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

var restaurantSchema = mongoose.Schema({
 name: {
   type: String,
   index: true,
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
   type: Number,
   index: true,
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
 },
 rating: { //average rating
  type: Number,
  required: true,
  index: true
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
 });
}

//restaurantSchema.methods.stars = function(callback){
//
//}

reviewSchema.virtual('score').get(function() {
 if (this.stars === 0) {
   return "☆☆☆☆☆"
 } else if (this.stars === 1) {
   return "★☆☆☆☆"
 } else if (this.stars === 2) {
   return "★★☆☆☆" 
 } else if (this.stars === 3) {
   return "★★★☆☆"
 } else if (this.stars === 4) {
   return "★★★★☆"
 } else if (this.stars === 5) {
   return "★★★★★"
 }
});

restaurantSchema.virtual('range').get(function() {
 if (this.price === 1) {
   return "$";
 } else if (this.price === 2) {
   return "$$";
 } else if (this.price === 3) {
   return "$$$";
 } else if (this.price ===4){
  return "$$$$";
 }
});

restaurantSchema.virtual('averageRating').get(function() {
 if (this.reviewCount>0) {
   if (Math.floor(this.totalScore/this.reviewCount) === 0) {
     return "☆☆☆☆☆"
   } else if (Math.floor(this.totalScore/this.reviewCount) === 1) {
     return "★☆☆☆☆"
   } else if (Math.floor(this.totalScore/this.reviewCount) === 2) {
     return "★★☆☆☆"
   } else if (Math.floor(this.totalScore/this.reviewCount) === 3) {
     return "★★★☆☆"
   } else if (Math.floor(this.totalScore/this.reviewCount) === 4) {
     return "★★★★☆"
   } else if (Math.floor(this.totalScore/this.reviewCount) === 5) {
     return "★★★★★"
   }
 }
});

restaurantSchema.statics.findNextTen = function(page, cb) {
  
  this.find()
  .skip(10*(page-1))
  .limit(11)
  .exec(function(error, restaurants){
    if(error){
      cb(error, null);
    }
    cb(null, restaurants);
  });
}

//composite indexes
restaurantSchema.index({"price": 1, "averageRating": 1})
restaurantSchema.index({"price": 1, "averageRating": -1})

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowSchema)
};
