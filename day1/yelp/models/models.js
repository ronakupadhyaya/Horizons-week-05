var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String 
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
    type: String
  }
});

userSchema.methods.getFollows = function (callback)
{
  var id = this._id;
  this.model('Follow').find({
    "$or": 
    [
    {from: id},
    {to: id}
    ]
  })
  .populate('from to')
  .exec(function(error, follows) 
  {
    var followers = [];
    var following = [];
    for (var i = 0; i < follows.length; i++) 
    {
      if(String(follows[i].from._id) === String(id)) 
      {
        console.log("adding following");
        following.push(follows[i]);
      } else 
        {
        followers.push(follows[i]);
        }
    }
    callback(error, followers, following);
  });
}


userSchema.methods.follow = function (idToFollow, callback){
var model = new Follow({
  from: this.id,
  to: idToFollow
})
  model.save(callback);
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  this.model('Follow').remove({from: this.id, to: idToUnfollow }, callback);
}

userSchema.methods.isFollowing = function(id, callback){
this.model('Follow').find({ from: this.id, to: id }, function(error, isFollowing)
  {
    if(isFollowing)
    {
      callback(true);
    }
      else
      {
        callback(false);
      }
  })
}

var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

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
    enum: [1, 2, 3],
    required: true
  },
  openTime: {
    type: Number,
    required: true
  },
  closingTime: {
    type: Number,
    required: true
  }
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
  Follow: mongoose.model('Follow', FollowsSchema)
};
