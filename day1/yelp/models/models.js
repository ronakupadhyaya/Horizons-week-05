var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);


var userSchema = mongoose.Schema({
  displayName: {
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
    city: {
      type: String,
      required: true
    },
    state: {
      type: String
    },
    country: {
      type: String,
      required: true
    }
 
  }
});

// userSchema.virtual('name.full').get(function(){
//   return this.name.first + ' ' + this.name.last;
// })


userSchema.virtual('location.full').get(function() {
  return this.location.city + ", " + this.location.state + " " + this.location.country;
});

userSchema.methods.getFollowers = function (callback){
  var thisId = this._id;
  Follow.find({to: this._id}).populate("from to").exec(function(err, followers){
    if (err) {
      callback(err);
    } else {
      console.log(thisId);
      Follow.find({from: thisId}).populate('to from').exec(function(err, following){
        callback(err, followers, following);
      });
    }
    
    
  });
}

userSchema.methods.isFollowing = function(idToFollow, callback) {
  Follow.find({
    from: this._id,
    to: idToFollow
  }, function(error, follow) {
    if (follow) {
      callback(null,true);
    } else {
      callback(error,false);
    }
})
}

userSchema.methods.follow = function (idToFollow, callback){

  // question: can we call isFollowing here?
  var ourId = this._id;
  Follow.findOne({
    from: this._id,
    to: idToFollow
  }, function(error, follow) {
    if (follow) {
      callback(null);
    }
    else {
     
      var newFollow = new Follow({
        from: ourId,
        to: idToFollow
      });
      
      newFollow.save(function(err) {
        if (err) throw "error";
        else {
          callback("Success!");
        }
      })
    }
  })

}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.find({
    from: this._id,
    to: idToUnfollow
  }, function(error, follow) {
    if (follow) {

       Follow.remove({
        from: this._id,
        to: idToFollow
        }, function(err) {
        if (err) throw "error";
        else {
          callback("Success!");
        }
  })

    }
  }
  )

 
}

var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

var Follow = mongoose.model('Follow', FollowsSchema);

var reviewSchema = mongoose.Schema({
  stars: {
    type: Number
  },
  content: {
    type: String
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId
  },
  user: {
    type: mongoose.Schema.Types.ObjectId
  }

});


var restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    min: [1, 'Choose a number between 1-3'],
    max: [3, 'Choose a number between 1-3'],
    required: true
  },
  category: {
    type: String,
     required: true
  },
  address: {
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
  openTime: {
    type: Number,
    min: 0,
    max: [23, 'Choose a number between 0-23'],
     required: true
  },
  closingTime: {
    type: Number,
    min: 0,
    max: [23, 'Choose a number between 0-23'],
     required: true
  },
  totalScore: {
    type: Number
  },
  reviewCount: {
    type: Number
  }

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
