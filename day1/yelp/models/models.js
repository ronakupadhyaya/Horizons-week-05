var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('../connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: { // to be hashed later
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});

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

var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
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

var reviewSchema = mongoose.Schema({

});

var Follow = mongoose.model('Follow', followSchema);
var Review = mongoose.model('Review', reviewSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);


userSchema.methods.getFollows = function(callback){ // typo : don't need first argument 'id'
// be prepared to use 'this' here instead of id lmao
var id = this._id
Follow.find({from: id}).populate('to').exec(function(err, foundFollowing) {
  if(err) {
    callback(err);
  } else {
    Follow.find({to: id}).populate('from').exec(function(err, foundFollowers) {
      if(err) {
        callback(err);
      } else {
        var data = {foundFollowers, foundFollowing}
        callback(null, data);
      }
    })
  }
})
}

userSchema.methods.follow = function(idToFollow, callback){
  var idFromFollow = this._id; // not req.user._id
  var idToFollow = idToFollow;
  Follow.findOne({to: idToFollow, from: idFromFollow}, function(err, foundFollow) {
    if(err) {
      callback(err);
    } else if(foundFollow) {
      console.log('found')
      callback(null, foundFollow);
    } else {
      console.log('here')
      var follow = new Follow({
        from: idFromFollow,
        to: idToFollow
      }).save(function(err) {
        if(err) {
          callback(err);
        } else {
          callback(null, follow); // null bc no err will happen here
        }
      });
    }
  })
}

userSchema.methods.unfollow = function(idToUnfollow, callback){
  var idFromFollow = this._id; // not req.user._id
  var idToFollow = idToUnfollow;
  Follow.findOne({to: idToFollow, from: idFromFollow}, function(err, foundFollow) {
    if(err) {
      callback(err);
    } else if(!foundFollow) {
      callback(null, {
        error: 'you dont follow this person'
      });
    } else {
      foundFollow.remove(function(err) { // or use findOneAndRemove
        if(err) {
          callback(err);
        } else {
          callback(null, foundFollow)
        }
      });
    }
  })
}

userSchema.methods.isFollowing = function(idToCheck, callback) {
  var myId = this._id;
  var idToCheck = idToCheck;
  Follow.findOne({from: myId, to: idToCheck}, function(err, foundFollow) {
    if(err) {
      callback(err);
    } else {
      callback(null, !!foundFollow);
    };
  })
}

var User = mongoose.model('User', userSchema);

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}

module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
