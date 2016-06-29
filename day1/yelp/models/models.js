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
      type: String
  }
});

var FollowsSchema = mongoose.Schema({
  follower: { //from
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  followed: { //to
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }
});


userSchema.methods.getFollows = function (callback){
  var that = this;
  Follow.find({
    follower: this._id
  }).populate('followed')
  .exec(function(error, usersImFollowing) {
    Follow.find({
      followed: that._id
    }).populate('follower')
    .exec(function(error, usersWhoFollowMe) {
      console.log(usersWhoFollowMe)
      callback(usersImFollowing, usersWhoFollowMe);
    });
  });
}


userSchema.methods.follow = function (idToFollow, callback){
  var newId = this._id;
  Follow.findOne({
    follower: newId,
    followed: idToFollow }, function(err, userImFollowing){
      if(userImFollowing){
        callback("Can't follow that person again");
      } else {
        var f = new Follow ({
          follower: newId,
          followed: idToFollow}).save(callback);
      }
    });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findOne({
    follower: this._id,
    followed: idToUnfollow
}, function(err, pair){
  if(err) {
    callback (err);
  }
    pair.remove(function(err, deleted){
      if(err){
        callback(err);
      }else {
        callback (null, deleted);
      }
    });
  });
}

userSchema.methods.isFollowing = function (id, callback){
  this.model('Follow').findOne({
    follower: this._id,
    followed: isFollowing
}, function(err,pair){
    if(err){
        callback(err);
      } else {
        callback(true);
    }
});
}


var reviewSchema = mongoose.Schema({
  stars: Number,
  content: {
      type: String,
      required: true
  },
  restaurantId: mongoose.Schema.ObjectId,
  user: mongoose.Schema.ObjectId
});


var restaurantSchema = mongoose.Schema({
  name: {
      type: String,
      required: true,
      unique: true},
  price: {
    type: Number,
    enum: [1,2,3],
    required: true
  },
  category: {
    type: String,
    enum: ["Mexican", "Food Stands", "Tex-Mex", "Food Trucks", "Pizza", "Bars", "Italian", "Mediterranean", "Indian", "Grocery"]
  },
  location: {
      latitude: Number,
      longitude: Number
    },
  openTime: {
    type: Number,
    required: true
  },
  closingTime: {
      type: Number,
      required: true
  },
  totalScore: Number,
  reviewCount: Number,
  rating: Number
});


restaurantSchema.methods.getReviews = function (restaurantId, callback){
  // var that = this;
  // Review.find({
  //   restaurantId: this._restaurantId
  // }).populate('followed')
  // .exec(function(error, usersImFollowing) {
  //   Follow.find({
  //     followed: that._id
  //   }).populate('follower')
  //   .exec(function(error, usersWhoFollowMe) {
  //     console.log(usersWhoFollowMe)
  //     callback(usersImFollowing, usersWhoFollowMe);
  //   });
  // });
  // }
}

//restaurantSchema.methods.stars = function(callback){
//
//}

var Follow = mongoose.model('Follow', FollowsSchema);
var Review = mongoose.model('Review', reviewSchema);
var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema) //this is a model
};  // each model has a name and a schema, schema holds all the methods
    //the collection of all the follows
