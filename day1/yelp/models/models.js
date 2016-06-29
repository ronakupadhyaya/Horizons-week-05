var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName:{
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
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
    },
    country: {
      type: String,
      required: true
    }
  }
});

// userSchema.virtual("name.full").get(function(){
//   return this.name.first + ' ' + this.name.last;
// })

userSchema.virtual("location.full").get(function(){
  return this.location.city + ' ' + this.location.state + ' ' + this.location.country;
})

userSchema.methods.getFollows = function (callback){
    var that = this;
  Follow.find({follower: this._id}).populate("following follower").exec(function(err, follower){
    if(err){
      callback(err);
    } else {
    Follow.find({following: that._id}).populate("follower following").exec(function(err, following){
 
      callback(err, follower, following)
    });
  }
  });
}

userSchema.methods.follow = function (idToFollow, callback){
  var that = this;
  Follow.findOne({
    follower: this._id,
    following: idToFollow
  }, function(err, follow){
    if(!follow) {
      var f = new Follow({
        follower: that._id,
        following: idToFollow
      });
      f.save(callback); 
    } else {
      callback(true, false)
    }
  })
}

userSchema.methods.isFollowing = function (idToFollow, callback){
  Follow.find({follower: this._id, following: idToFollow}, function(error, follow){
    if(follow){
      callback(true);
    } else callback(false);
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.find({
    follower: this._id, 
    following: idToUnfollow
  }, function(err, follow){
    if(follow){
      Follow.remove(follow, function(err){
        if (err) throw "Error";
        else {
          callback(this._id, "Success")
        }
      })
     }
  })
}




var FollowsSchema = mongoose.Schema({
  follower:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  following:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
});

var Follow = mongoose.model("Follow", FollowsSchema);


var reviewSchema = mongoose.Schema({
  content:{
    type: String,
  },
  stars:{
    type: Number
  },
  restaurantId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
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
    enum: ["Mexican", "Food Stands", "Tex-Mex", "Food Trucks", "Pizza", "Bars", "Italian", "Mediterranean", "Indian", "Grocery"],
    required: true
  },
  rating:{
    type: Number
  },
  location:{
    latitude: Number,
    longitude: Number,
    address: String
  },
  price: {
    type: Number,
    enum: [1,2,3],
    required: true
  },
  openTime: {
    type: Number,
  },
  closingTime: {
    type: Number,
  }, 
  totalScore: Number,
  reviewCount: Number,
  averageRating: {
    type: Number,
    min: 1,
    max: 5,
    index: true
  }
});



restaurantSchema.methods.getReviews = function (restaurantId, callback){
Review.find({restaurantId: restaurantId}).populate("userId").exec(function(error, reviewArray){
  if(err){
      callback(err);
    } else {
callback(err, reviewArray)
}
})
}


// restaurantSchema.virtual('averageRating').get(function () {
//   return this.totalScore / this.reviewCount;
// });

// restaurantSchema.methods.stars = function(callback){

// }

restaurantSchema.statics.getTen= function(n, cb) {
Restaurant.find()
          .limit(10)
          .skip(10 * (n -1))
          .sort({name : 1})
          .exec(function(error, restaurants){
            if (error) return (error);
              else {
                cb(error, restaurants)
              }
          })

}

restaurantSchema.index({"price": 1, "averageRating": 1})
restaurantSchema.index({"price": 1, "averageRating": -1})

var Restaurant = mongoose.model("Restaurant", restaurantSchema);


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
