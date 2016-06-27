// ----------------------------------------------
// Horizons YELP models & schemas
// ----------------------------------------------

// ----------------------------------------------
// Import dependencies
// ----------------------------------------------
var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('../connect');
mongoose.connect(connect);

// ----------------------------------------------
// bcrypt dependency & constant
// ----------------------------------------------
var bcrypt = require('bcrypt');
const saltRounds = 10;

// ----------------------------------------------
// Log successful connection in console
// ----------------------------------------------
var db_connection = mongoose.connection;
db_connection.once('open', function callback () {
       console.log("DB Connected!");
});

var userSchema = mongoose.Schema({
  displayName:{
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
  location:{
    type: String,
    required: true
  }
});

// ----------------------------------------------
// Hashes password before saving it
// ----------------------------------------------
userSchema.pre('save', function(next) {
  var user = this;

  // hash the password only if the password has been changed or user is new
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(saltRounds, function(err, salt) {
    if(err) return console.error(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // change the password to the hashed version
      user.password = hash;
      next();
    });

  });
});

// ----------------------------------------------
// Compare password hash
// ----------------------------------------------
userSchema.methods.comparePassword = function(password) {
  var user = this;
  // ----------------------------------------------
  // SYNC CALL FOR NOW
  // ----------------------------------------------
  return bcrypt.compareSync(password, user.password);
};

userSchema.methods.getFollowers = function (id, callback){
  // Find Following
  Follow.find({user1Id: id}).populate('user2Id').exec(function(err, following) {
    //Find Followers
    Follow.find({user2Id: id}).populate('user1Id').exec(function(err, followers) {
      callback(err, followers, following);
    });
  });
}
userSchema.methods.follow = function (idToFollow, callback){
  var user = this;
  Follow.find({uid1:user._id, uid2: idToFollow}, function(err, follows) {
      if (err) return next(err);
      if (follows.length<=0){
        var follow = new Follow({
          uid1: user._id,
          uid2: idToFollow
        });
        follow.save(function(err) {
          callback(err)
        })
      }
      else {
        callback(null);
      }
    });
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  var user = this;
  Follow.find({user1Id:user._id, user2Id: idToUnfollow}).remove(function(err) {
    callback(err)
  })
}

var FollowsSchema = mongoose.Schema({
  user1Id:{type: mongoose.Schema.ObjectId, ref: 'User'},
  user2Id:{type: mongoose.Schema.ObjectId, ref: 'User'}
});

var reviewSchema = mongoose.Schema({

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
  Follow: mongoose.model('Follow', FollowsSchema)
};
