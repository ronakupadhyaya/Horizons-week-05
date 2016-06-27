var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  name: {
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

userSchema.methods.getFollowers = function (id, callback) {
// create array of all followers and all following
// populate allFollowers and allFollowing arrays with the ids corresponding to this user's followers
// allFollowers = [{
//     from: {
//         _id: ID_OF_FOLLOWER,
//         displayName: "Moose Paksoy",
//         email: "moose@joinhorizons.com",
//         location: "San Francisco"
//     },
//     to: YOUR_USER_ID
// }, {
//     from: {
//         _id: ID_OF_FOLLOWER,
//         displayName: "Fast Lane",
//         email: "lane@joinhorizons.com",
//         location: "New York City"
//     },
//     to: YOUR_USER_ID
// }];

// allFollowing = [{
//     from: YOUR_USER_ID,
//     to: {
//         _id: ID_OF_USER_YOU_ARE_FOLLOWING,
//         displayName: "Josh",
//         email: "josh@joinhorizons.com",
//         location: "Rutgers"
//     }
// }]

  this.model('Follow').find({userFrom: id})
    .populate('userTo').exec(function(err, followers) {
        this.model('Follow').find({userTo: id})
          .populate('userFrom').exec(function(err, following) {
            callback(err, followers, following);
          })
    })
}

userSchema.methods.follow = function (idToFollow, callback) {
// populate Follows with userFrom being this user, and userTo becoming idToFollow 
// also check if idToFollow is the userTo of this userFrom, and if so, throw an error or simply return nothing
  this.model('Follow').find({userFrom: this._id, userTo: idToFollow}, function(err, follows) {
    var follows = new Follow ({
      userFrom: this._id,
      userTo: idToFollow
      }).save(function(err) {
        callback(err);
      })
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  this.model('Follow').find({userFrom: this._id, userTo: idToFollow}).remove(function(err) {
    callback(err);
  })
}

var FollowsSchema = mongoose.Schema({
  // userFrom is the person following someone else 
  userFrom: {
    type: mongoose.Schema.ObjectId,
    ref: User
  },
  // userTo is the person being followed
  userTo: {
    type: mongoose.Schema.ObjectId,
    ref: User
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

restaurantSchema.methods.stars = function(callback){

}


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
