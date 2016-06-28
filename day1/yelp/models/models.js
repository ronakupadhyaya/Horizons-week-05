var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String,
    required:true
   
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
    required:true
   
  }
});

userSchema.methods.getFollowers = function (callback){
 // Follow.find({to: this._id}, function(err, followers){
 //   Follow.find({from: this._id}, function(err, following){
 //     callback(followers, following)
 //   })
 // })
 var that = this;
 Follow.find({
   $or: [
   {from: this._id},
   {to: this._id}]
 })
 .populate('from to')
 .exec(function(err, follows) {
   console.log("asaldkfjds", follows);
    var followers = [];
    var following = [];

   for (var i = 0; i < follows.length; i ++) {
    console.log('x', follows[i].from._id, that._id, follows[i].from._id === that._id);
     if (follows[i].from._id.equals(that._id)) {

       following.push(follows[i]);
     } else {
       followers.push(follows[i]);
     }
   }

 callback(followers, following);
 })
}


userSchema.methods.follow = function (idToFollow, callback){
  var that = this;
 Follow.findOne({userTo: idToFollow, userFrom: that._id}, function(err, follows) {
   if (follows){
     callback(null);
   } else {
     var follow = new Follow({
       from: that._id,
       to: idToFollow
     }).save(callback) 
   }
 })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
Follow.remove({from: this._id, to:idToUnfollow}, callback)
 
}
userSchema.methods.isFollowing = function(id, callback){
  Follow.find({from:this._id, to:id},function(err, follow){
    if(follow){
      callback(null, true);
    } else{
      callback(null, false);
    }
  })
}


var FollowsSchema = mongoose.Schema({
  from:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  }, 
  to:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  }

});
// 
var Follow = mongoose.model('Follow', FollowsSchema)
var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({
  name:{
    type:String, 
    required: true
  }, 
  category:{
    type:String,
    enum:["korean","italian","BYO"],
    required:true
  }, 
  location:{
    latitude:Number,
    longitude:Number
  }, 
  price:{
    type:Number, 
    enum:[1,2,3],
    required:true
  }, 
  openTime:{
    type:Number,
    required:true
  },
  closingTime:{
    type:Number,
    required:true
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
