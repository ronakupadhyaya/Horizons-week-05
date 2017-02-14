var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('../connect');
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
    type: String
  },
  location: {
    type: String
  }
});

var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({
  stars: {
    type: Number,
    enum: [1,2,3,4,5]
  },
  content: String,
  restuarant: String,
  user: {
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
    type: String
    enum: ['Korean', 'Indian', 'Chinese', 'Italian', 'Ethiopian']
  },
  latitude: Number,
  longitude: Number,
  price: {
    type: 'String',
    enum: ['$', '$$']
  },
  opentime: Number,
  closingtime: Number
});
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);

userSchema.methods.getFollows = function (callback){
  Follow.find({to: this._id }).populate('from').exec(function(err, peopleThatFollowMe){
    Follow.find({from: this._id}).populate('to').exec(function(err, peopleThatIFollow){
      callback(err, peopleThatFollowMe, peopleThatIFollow);
    })
  })
}

userSchema.methods.isFollowing = function(id, callback){
  Follow.findOne({from: this._id, to: id}, function(err, follow){
    if(err){
      console.log('Error:', err);
    } else{
      if(follow.to){
        callback(true);
      } else{
        callback(false);
      }
    }
  })
}

userSchema.methods.follow = function (idToFollow, callback){
  var self = this;
  User.findById(idToFollow, function(err, user){
    if(err){
      console.log('Error: ', err);
    } else{
      Follow.findOne({from: self._id, to: idToFollow},
        function(err, follow){
          if(err){
            console.log('Error :', err);
          } else{
            if(!!follow){
              console.log("You've already followed" + user);
            } else{
              var newFollow = new Follow({
                from: self,
                to: user
              })
              newFollow.save(function(err){
                if(err){
                  console.log(err);
                } else{
                  console.log("Saved follow");
                }
              })
            }
          }
        })
      }
      callback(err);
    });
  }

  userSchema.methods.unfollow = function (idToUnfollow, callback){
    Follow.findOne({from: this._id, to: idToUnfollow}, function(err, follow){
      if(err){
        console.log('Error: ',err);
      } else{
        if(!! follow){
          follow.remove(function(err){
            if(err){
              console.log('Error :', err);
            } else{
              console.log('You no longer follow somebody');
            }
          })
        }
      }
      callback(err);
    })
  }
  var User = mongoose.model('User', userSchema)





  // restaurantSchema.methods.getReviews = function (restaurantId, callback){
  //
  // }

  //restaurantSchema.methods.stars = function(callback){
  //
  //}



  module.exports = {
    User: User,
    Restaurant: Restaurant,
    Review: Review,
    Follow: Follow
  };
