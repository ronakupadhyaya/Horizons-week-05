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

<<<<<<< HEAD
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
=======
userSchema.methods.getFollows = function (id, callback){
>>>>>>> master

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

}

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["Korean", "Italian", "Chinese", "Mexican", "BYO"],
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  price: {
    type: Number,
    enum: ["1","2","3"],
    required: true
  },
  openTime: {
    type: String,
    required: true
  },
  closingTime: {
    type: String,
    required: true
  }
});

// restaurantSchema.methods.getReviews = function (restaurantId, callback){

<<<<<<< HEAD
// }
=======
}
>>>>>>> master

//restaurantSchema.methods.stars = function(callback){
//
//}

var Follow = mongoose.model('Follow', followSchema);

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: Follow
};