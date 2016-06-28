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

userSchema.methods.getFollowers = function (id, callback){
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
  var newFollow = new FollowSchema({
    from: this_.id,
    to: idToFollow
  });
  callback(newFollow);
}


userSchema.methods.unfollow = function (idToUnfollow, callback){
  var array = Follow.find({to: to}).populate("Follow")

  for (var i = 0; i <array.length; i++){
    if (array[i][to] === idToUnfollow){
      array[i].delete()
    }
  }

}

var FollowSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.objectId,
    ref: "User"
    },
  to: {
  type: mongoose.Schema.Types.objectId,
  ref: "User"
    },
});
callback();

var reviewSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["Korean, Italian", "Mexican", "Chinese", "BYO"],
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  price: {
    type: Number,
    enum: [1,2,3],
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
  Follow: mongoose.model('Follow', FollowSchema)
};
