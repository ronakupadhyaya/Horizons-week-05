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


userSchema.methods.getFollowers = function (cb) {
  var that = this;
  this.model('Follow').find({
    userFrom: this._id
  })
    .populate('userTo')
    .exec(function(err, followers) {
        that.model('Follow').find({
          userTo: that._id
        })
          .populate('userFrom')
          .exec(function(err, following) {
            cb(err, followers, following);
          })
    })


}
userSchema.methods.follow = function (idToFollow, callback) {
// populate Follows with userFrom being this user, and userTo becoming idToFollow 
// also check if idToFollow is the userTo of this userFrom, and if so, throw an error or simply return nothing
  this.model('Follow').find({userFrom: this._id, userTo: idToFollow}, function(err, follows) {
    var follows = new Follow ({
      userFrom: this._id,
      userTo: idToFollow
      }).save(function(err) {
        callback(err);
      })
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  this.model('Follow').find({userFrom: this._id, userTo: idToUnFollow}).remove(function(err) {
    callback(err);
  })
}

// userScema.methods.getReviews = function(userId, callback) {
//     this.model('Review').find({userId: userId}).populate('content stars restaurantId').exec(function(err, reviews) {
//       callback(err, reviews);
//   })
// }

var FollowsSchema = mongoose.Schema({
  // userFrom is the person following someone else 
  userFrom: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  // userTo is the person being followed
  userTo: {
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
    required: true
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
//   Name (String) - the name of the Restaurant
// Category (String) - the type of the Restaurant ("Korean", "Barbeque", "Casual")
// Latitude (Number) - the latitude of the Restaurant's location
// Longitude (Number) - the longitude of the Restaurant's location
// Price (Number) - the descriptive scaling of a restaurants price, on a scale of 1-3
// Open Time (Number) - an hour of opening time (assume Eastern Time, UTC-4) between 0-23
// Closing Time (Number) - an hour of closing time between 0-23
  name: {
    type: String,
    index: {
    required: true
    }
  },
  category: {
    type: String,
    index: {
    required: true
    }
  },
  // lat: {
  //   type: Number,
  //   required: true
  // },
  // long: {
  //   type: Number,
  //   required: true
  // },
  price: {
    type: Number,
    index: {
    required: true
    }
  },
  openTime: {
    type: Number,
    index: {
    required: true
    }
  },
  closeTime: {
    type: Number,
    index: {
    required: true
    }
  }
});

restaurantSchema.methods.getReviews = function (restaurantId, callback) {
 // var that = this;
 //  this.model('Follow').find({
 //    userFrom: this._id
 //  })
 //    .populate('userTo')
 //    .exec(function(err, followers) {
 //        that.model('Follow').find({
 //          userTo: that._id
 //        })
 //          .populate('userFrom')
 //          .exec(function(err, following) {
 //            cb(err, followers, following);
 //          })
 //    })
 
  this.model('Review').find({restaurantId: restaurantId}).populate('userID').exec(function(err, reviews) {
      callback(err, reviews);
  })
}

//restaurantSchema.methods.stars = function(callback)
//
//}

// RestaurantSchema.statics.getTen = function(n) {
//     var x = n*10;
//     this.model('Restaurant').find()
// }

module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
