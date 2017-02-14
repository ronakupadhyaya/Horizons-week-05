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
  displayName:{
    type: String,
    required: true
  },
  location:{
    type: String
  }
});

userSchema.methods.getFollows = function (id, callback){
  Follow.find({followee:id}).populate('follower').exec(function(err,followers){
    if(err) callback(err);
    else{
      Follow.find({follower:id}).populate('followee').exec(function(err,followees){
        if(err) callback(err);
        else{
          callback(err, {followers:followers, followees: followees});
        }
      });
    }
  });
}
userSchema.methods.follow = function (idToFollow, callback){
  var id= this._id;
  Follow.findOne({follower:id, followee: idToFollow},function(err,follow){
    if(err){
      callback(err);
    }if(!follow){
      new FollowSchema ({follower:id,followee:idToFollow}).save();
      callback(null)
    }
    else{
      callback(null);
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var id = this._id;
  Follow.findOneAndRemove({follower:id,followee:idToUnfollow}, function(err){
    if(err) callback(err);
    else{
      callback(null);
    }
  });
}

userSchema.methods.isFollowing = function (idFollow, callback){
  var id = this._id;
  Follow.findOne({follower:id ,followee:idFollow }, function(err, follow){
    if(err) callback(err);
    if(!follow) callback(false);
    else{
      callback(true);
    }
  });
}


var FollowsSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  followee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

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
  Follow: mongoose.model('Follow', FollowsSchema)
};
