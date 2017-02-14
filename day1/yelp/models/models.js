var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('../connect');
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
    type:String,
    required: true
  },
  location: {
    type: String,
    require: true
  }
});

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

userSchema.methods.getFollows = function (callback){
  Follow.find({from: this._id}).populate('from').exec(function(err, allFollowers) {
    if(err) callback(err);
    Follow.find({to:this._id}).populate('to').exec(function(err,allFollowing){
      if(err) callback(err);
      else{
        callback(null,allFollowers,allFollowing);
      }
    })
  })
}

//
// //statics
// User.getFollows();
//
// // methods
// var user1 = new User();
// user1.follow(user2, function(err) {
//   if(err) console.log(err);
// })
// user1.getFollows(function(err, followers, followees){
//
// })
userSchema.methods.follow = function (idToFollow, callback){
  var follower = this._id
  Follow.findOne({from: this._id, to:idToFollow}, function(err,follow) {
    if(err) callback(err);
    if(follow) {
      callback(null,{
        error: 'Already following'
      })
    } else {
      var newFollow = new Follow({
        from: follower,
        to: idToFollow
      })
      // newFollow.save(function(err){
      //   if(err) callback(err);
      //   else {
      //     callback(null,newFollow);
      //   }
      // });
      newFollow.save(callback);
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findOne({to:idToUnfollow}, function(err,follow){
    if(err) callback(err);
    if(!follow) {
      callback(null, {error: 'Not currently following'})
    } else if(follow) {
      follow.remove(callback)
    } else{
      callback(null,null)
    }
  })
}

userSchema.methods.isFollowing = function(userId, callback) {
  Follow.findOne({from:this._id,to:userId}, function(err,follow){
    if(err) console.log(err);
    if(follow) {
      callback(null,true);
    } else {
      callback(null,false);
    }
  })
}

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  name: String,
  category: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  openTime: Number,
  closeTime: Number
});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

var Follow = mongoose.model('Follow', FollowsSchema);

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: Follow
};
