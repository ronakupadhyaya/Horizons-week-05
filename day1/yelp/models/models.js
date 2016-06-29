var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  garden: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Garden'
  }],
  name: String,
  about: String
});

userSchema.methods.getGardens = function (id, callback){
  Garden.find({_owner: id}, function(err, garden) {
    console.log(id)
    console.log(garden)
    callback(err, garden);
  });
};

userSchema.methods.getFollows = function(id, callback) {
  Follow.find({user: id}).populate('garden').exec(function(err, following) {
    callback(following);
  });
}

userSchema.methods.follow = function (user, garden, callback){
  Follow.find({user:user, garden: garden}, function(err, follows) {
    if (err) return next(err);
    console.log("asd")
    console.log(follows)
    if (follows.length<=0){
      var follow = new Follow({
        user: user,
        garden: garden
      });
      follow.save(callback)
    }
    else {
      callback(null);
    }
  });
}

userSchema.methods.unfollow = function (user, garden, callback){
  Follow.find({user:user, garden: garden}).remove(function(err) {
    callback(err)
  });
}

userSchema.methods.isFollowing = function(garden, callback){
  Follow.find({user: this._id, garden: garden}, function(err, following) {
    callback(following);
  });
}

var FollowsSchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.ObjectId,
    ref: 'User'
    },
  garden : { 
    type: mongoose.Schema.ObjectId, 
    ref: 'Garden'
  }
});

var reviewSchema = mongoose.Schema({
  stars: Number, // 1 -> 5
  content: String,
  garden: { 
    type: mongoose.Schema.ObjectId,
    ref: 'Garden' 
  },
  user: { 
    type: mongoose.Schema.ObjectId, 
    ref: 'User' 
  }
});

var gardenSchema = mongoose.Schema({
  name: String,
  cropType: String,
  soldBy: {
    type: String,
    enum: [
      "Weight",
      "Weight (from-plant)",
      "Quantity",
      "Quantity (from-plant)"
    ]
  },
  price: Number,
  location: {
    latitude: Number,
    longitude: Number
  },
  _owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

gardenSchema.methods.getFollowers = function (id, callback){
  // Find Following
  Follow.find({garden: id}).populate('user').exec(function(err, following) {
    console.log(id)
    console.log(following)
    callback(err, following)
  });
};

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}


module.exports = {
  User: mongoose.model('User', userSchema),
  Garden: mongoose.model('Garden', gardenSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
