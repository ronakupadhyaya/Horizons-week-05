var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  username: {
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

<<<<<<< HEAD
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
=======
userSchema.methods.getFollows = function (id, callback){
>>>>>>> master

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

  var f = new Follow ({
    follower: this._id,
    followed: idToFollow}).save(callback)
}
userSchema.methods.unfollow = function (idToUnfollow, callback){
  this.model('Follow').findOne({
    follower: this._id,
    followed: idToUnfollow
}), function(err, pair){
  if(err) {
    callback (err);
  }
    pair.remove(function(err, deleted){
      if(err){
        callback(err);
      }else {
        callback (deleted);
      }
    });
  }}

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
  content: String,
  restaurantId: mongoose.Schema.ObjectId,
  user: mongoose.Schema.ObjectId
});


var restaurantSchema = mongoose.Schema({
  name: {
      type: String,
      required: true},
  price: {
    type: Number,
    enum: [1,2,3],
    required: true
  },
  category: {
    type: String,
    enum: ["Korean", "French", "American", "Indian", "BYO"]
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
  reviewCount: Number
});


restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema) //this is a model
};  // each model has a name and a schema, schema holds all the methods
    //the collection of all the follows
