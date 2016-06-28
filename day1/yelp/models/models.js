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
  content: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    enum: [1,2,3,4,5]
  },
  restaurantId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant'
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});


var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["Korean", "Italian", "Chinese", "Mexican", "BYO"]
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  price: {
    type: Number,
    enum: [1,2,3]
  },
  openTime: {
    type: Number
  },
  closingTime: {
    type: Number
  },
  address: String
});

restaurantSchema.methods.getReviews = function (callback){
  Review.find({restaurantId: this._id}).populate('userId').exec(function(err,reviews){
    if(err){
      callback(err)
    }
    else{
      callback(null,reviews)
    }
  })
}

userSchema.methods.getUserReviews = function (callback){
  Review.find({userId: this._id}).populate('restaurantId').exec(function(err,reviews){
    if(err){
      callback(err)
    }
    else{
      callback(null,reviews)
    }
  })
}

var Follow=mongoose.model('Follow',followSchema)
var Review=mongoose.model('Review',reviewSchema)

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', followSchema)
};
