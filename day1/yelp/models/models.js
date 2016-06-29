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
    required: true,
    index: { unique: true }
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

var FollowsSchema = mongoose.Schema({
  user1Id:{type: mongoose.Schema.ObjectId, ref: 'User'},
  user2Id:{type: mongoose.Schema.ObjectId, ref: 'User'}
});

var Follow = mongoose.model('Follow', FollowsSchema);

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
  Follow.find({user1Id:user._id, user2Id: idToFollow}, function(err, follows) {
      if (err) return next(err);
      if (follows.length<1){
        var follow = new Follow({
          user1Id: user._id,
          user2Id: idToFollow
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

// gets reviews for a particular user ID
userSchema.methods.getReviews = function (userId, callback){
  Review.find({uId: userId}).populate('rId').exec(function(err, reviews){
    callback(err, reviews);
  });
}

var reviewSchema = mongoose.Schema({
  content: {type: String, required: true},
  stars: {type: Number, required: true},
  rId: {type: mongoose.Schema.Types.ObjectId, ref:'Restaurant'},
  uId: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
});

var Review = mongoose.model('Review', reviewSchema);



var restaurantSchema = mongoose.Schema({
  name: {type: String, required: true, index: { unique: true }},
  category: {type: String, required: true},
  latitude: {type: Number, required: true},
  longitude: {type: Number, required: true},
  price: {type: String, required: true},
  opentime: {type: Number, required: true},
  closingtime: {type: Number, required: true},
  totalScore: {type: Number, default: 0},
  reviewCount: {type: Number, default: 0},
  averageRating: {type: Number, default: 0}
});

// gets reviews for a particular restaurant ID
restaurantSchema.methods.getReviews = function (restaurantId, callback){
  Review.find({rId: restaurantId}).populate('uId').exec(function(err, reviews){
    callback(err, reviews);
  });
}


// restaurantSchema.virtual('averageRating').get(function(callback){
//   var average = this.totalScore / this.reviewCount;
//   return average;
// });


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: Review,
  Follow: Follow
};
