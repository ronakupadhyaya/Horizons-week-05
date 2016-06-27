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

userSchema.methods.getFollows = function (id, callback){
  this.model('Follow').find({$or: [{followed: id}, {follower: id}]}).populate('follower followed').exec(function(err,follows){
    var allFollowers=[];
    var allFollowed=[];
    for(var i=0; i<follows.length; i++){
      if(follows[i].followed===id){
        allFollowers.push(follows[i])
      }
      else{
        allFollowed.push(follows[i])
      }
    }
    callback(null, {followers: allFollowers, followed: allFollowed})
  })
}

userSchema.methods.follow = function (idToFollow, callback){
  this.model('Follow').findOne({followed: idToFollow, follower: this._id}, function(err, follows){
    if(follows){
      callback("already following")
    }
  else{
    var follow = new Follow({
      follower: this._id,
      followed: idToFollow
    })
    follow.save(callback)
  }
})
}


userSchema.methods.unfollow = function (idToUnfollow, callback){
  this.model('Follow').remove({followed: idToFollow, follower: this._id},function(err,follows){
    if(follows){
      callback(null,"unfollowed")
    }
    else{
      callback("unfollow unsuccessful")
    }
  })
}

userSchema.methods.isFollowing = function(id, callback){
  this.model('Follow').findOne({follower: this._id, followed: id}, function(err,follows){
    if(err){
      callback(err)
    }
    else if(!follows){
      callback(null,{status: false})
    }
    else{
      callback(null,{status: true})
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


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
