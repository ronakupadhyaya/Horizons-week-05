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
  displayName: {
    type: String,
    required: true
  },
  location: {
      type: String,
      required: true
  }
});

userSchema.methods.getFollows = function (id, callback){
 this.model('follow').find({ //this refers to the user that's calling it --> the model
  followed: id
});
.populate('follower')
.exec(function(err, myFollowers){
    //do another find function to find all the people who we follow
    Follow.find({
        follower:id
    })
    .populate('followed')
    .exec(function(err, myFollowed){
      callback(err, myFollowers, myFollowed)
    })
}
)
}
userSchema.methods.follow = function (idToFollow, callback){
    this.model('Follow').findOne({
      follower: this._id,
      followed: idToFollow
    }), function(err, pair){
        if(!err && pair === null){
            var n = new Follow({
                follower: this._id,
                followed:idToFollow
            });
            n.save(function(error){
                if(error){ callback(error); }
            });
        } else if(err){
            callback(err);
        } else { callback(pair); }
    }

}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  this.model('Follow').findOne({
    follower: this._id,
    followed: idToUnfollow
}), function(err, pair){
  if(err) {
    callback (err);
  }
    pair.remove(function(err, deleted){
      if(err){
        callback(err);
      }else {
        callback (deleted);
      }
    });
  }})

var FollowsSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.ObjectId,
    ref: User,
  },
  followed: {
    type: mongoose.Schema.ObjectId,
    ref: User
  }
});

var reviewSchema = mongoose.Schema({
  stars: Number,
  content: String,
  restaurantId: mongoose.Schema.ObjectId,
  user: mongoose.Schema.ObjectId
});


var restaurantSchema = mongoose.Schema({
  name: String,
  price: String,
  category: {
    type: String,
    enum: ["Korean", "French", "American", "Indian"]
  },
  latitude: Number,
  longitude: Number,
  openTime: Number,
  closingTime: Number,
  totalScore: Number,
  reviewCount: Number
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
  Follow: mongoose.model('Follow', FollowsSchema) //this is a model
};  // each model has a name and a schema, schema holds all the methods
    //the collection of all the follows
