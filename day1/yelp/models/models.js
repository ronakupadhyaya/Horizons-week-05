var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('../connect').MONGODB_URI;
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
  location:{
    type:String
  },
  displayName: {
    type:String,
    required:true
  }
});

var FollowsSchema = mongoose.Schema({
  from:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  to:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  }

});
var Follow = mongoose.model('Follow', FollowsSchema);


var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

});

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}
var Restaurant =  mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema)


//restaurantSchema.methods.stars = function(callback){
//
//}


userSchema.methods.getFollows = function (callback){
  // This method will go through and find all Follow
  // documents that correspond to both user relationships where the
  // user's ID (accessible by the caller of the function,
  //   this._id) is the from and where the user is the to of a Follow relationship.
  //    In other words, you want both the Users the user follows and the Users
  //    the user is being followed by returned by this function. This should
  //    call the callback method with the followers and users you are following
  //    with something like allFollowers and allFollowing.

  //static called on Follow
  //method called on instance of Follow
  Follow.find({from:this._id}).populate('from')
  .exec(function(err, followers){
    if (err){ callback(err);
    } else{ Follow.find({to:this._id}).populate('to').exec(function(err, followees){
      if (err){ callback(err);
      } else{
        callback(null, followers, followees);
      }
    })
  }
})

}


userSchema.methods.follow = function (idToFollow, callback){
  // You should take in a parameter idToFollow of the user to follow;
  // now, calling .follow on the logged-in user will follow the
  // user given by idToFollow! follow should also check if you have followed
  // that user already and prevent you from creating duplicate Follow documents.

  //
  //
  // callback(err); //if err
  // callback(null, follow); // if you find the foloow or if you create it


  Follow.findOne({to:idToFollow}, function(err, follow){
    if (err){
      callback(err);
    }
    if (!follow){
      var newFollow = new Follow({from:this._id, to: idToFollow});
      newFollow.save(callback);
    }else{
      callback(null, follow);
    }
  })

}
userSchema.methods.isFollowing = function(id, callback){
  Follow.findOne({from:this._id, to:id}, function (err, follow){
    if (err) callback(err);
    if (follow){callback(null, true);}
    else{callback(null, false);}
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  // deletes the relationship represented by a Follow document
  //  where User 1 (the caller of the unfollow function)
  //  follows User 2 (given by a parameter idToUnfollow).
  Follow.findOne({to:idToUnfollow}, function(err, follow){
    if (err) callback(err);
    if (follow){
      follow.remove(function(){
        callback(null, follow);
      });
    }else{
      callback(null,null); //ASK LASTER PLESSSS
    }
  })
}
var User = mongoose.model('User', userSchema);

module.exports = {
  Follow: Follow,
  User: User,
  Restaurant: Restaurant,
  Review: Review
};
