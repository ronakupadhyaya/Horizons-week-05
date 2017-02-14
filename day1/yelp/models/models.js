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
  display: {
    type: String,
    required: true
  },
  location: {
    type: String
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

var Follow = mongoose.model('Follow', FollowsSchema)

userSchema.methods.getFollows = function (callback){
  var referredUser = this;
  Follow.find({to: referredUser._id})
  .populate('from')
  .exec(function(err, allFollowers){
    Follow.find({from: referredUser._id}).
    populate('to')
    .exec(function(err, allFollowing){
      //TODO: CHECK FOR AN ERROR;
      callback(allFollowers, allFollowing)
    })
  })
}
userSchema.methods.follow = function (idToFollow, callback){
  //TODO: PERHAPS CHECK IF THE DOC ALREADY EXIST
  (new Follow({from: this._id, to: idToFollow}))
  .save(function(err){
    callback(err)
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findOneAndRemove({from: this._id, to: idToUnfollow}, function(err){
    //TODO: CHECK IN CASE OF NO OBJECT FOUND
    callback(err)
  })
}

userSchema.methods.isFollowing = function(followeeId, callback){
  Follow.findOne({from: this._id, to: followeeId}, function(err, retObj){
    if (err){
      throw "modafookin error"
    } else if (retObj){
      callback(true);
    } else {
      callback(false);
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
  price: {
    type: Number,
    enum: [1,2,3]
  },
  open: {
      type:Number,
      min: 0,
      max: 23
  },
  close: {
    type:Number,
    min: 0,
    max: 23
  },
  address: String
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
  Follow: Follow
};
