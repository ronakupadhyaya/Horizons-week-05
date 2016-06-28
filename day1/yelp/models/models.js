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

userSchema.methods.getFollows = function (callback){
  var that=this;
  Follow.find({
    from: this._id
  })
  .exec(function(error, usersImFollowing){
    Follow.find({
      to: that._id
    }).populate('to from')
    .exec(function(error,usersWhoFollowMe){
     // console.log(usersWhoFollowMe)
      callback(usersImFollowing,usersWhoFollowMe)
    })
  })
  };

userSchema.methods.follow = function (idToFollow, callback){
var f = new Follow({
  from:this._id,
  to: idToFollow
}).save(callback)
}

var followSchema= mongoose.Schema({
  from:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  to:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

userSchema.methods.unfollow = function (idToUnfollow, callback){
  this.model('Follow').remove({to: idToUnfollow, from: this._id},function(err,follows){
    if(follows){
      callback(null,"unfollowed")
    }
    else{
      callback("unfollow unsuccessful")
    }
  })
}

userSchema.methods.isFollowing = function(id, callback){
  Follow.findOne({to: id}, function(err,follows){
    if(!follows){
      callback(false)
    }
    else{
      callback(true)
    }
  })
}

var FollowsSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  followed: {
    type: mongoose.Schema.ObjectId,
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

var Follow=mongoose.model('Follow',followSchema)

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', followSchema)
};
