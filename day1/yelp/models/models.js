var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);


var userSchema = mongoose.Schema({
  displayName: {
	type: String
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
	  type: String
  }
});

userSchema.methods.getFollowers = function (callback){
	
Follow.find({from: this.id}).populate('User').exec(function(error, following){
	Follow.find({to: this.id}).populate('User').exec(function(error, followers){
		callback(followers, following);	
	});
	

	});
}
userSchema.methods.follow = function (idToFollow, callback){
 Follow.find({from: this.id, to: idToFollow}, function(err, docs){
		if(docs.length){
			callback('already following!');
		} else {
			var follow = new Follow({
				from: this.id,
				to: idToFollow
			})
			
			follow.save();
			callback("following!");
		}
	})
		
}

userSchema.methods.isFollowing = function(id, callback) {
	Follow.find({from: this.id, to: id}, function(err, docs){
		if(docs.length){
			callback(true);
		} else{
			callback(false);
		}
	})
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
	Follow.findOneAndRemove({from: this.id, to: idToUnfollow});
}


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

var reviewSchema = mongoose.Schema({
	content: String,
	stars: Number,
	restaurant: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Restaurant'
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});


var restaurantSchema = mongoose.Schema({
	name:{
		type: String,
	},
	category: String,
	latitude: Number,
	longitude: Number,
	price: Number,
	openTime: String,
	closeTime: String
	
});

restaurantSchema.methods.getReviews = function (callback){
	Review.findById(this.id).populate('user').exec(function(error, reviews){
		callback(reviews);
	})
	
}

restaurantSchema.virtual('averageRating').set(function(){
	var sum = 0;
	Review.find({restaurant: this.id}, function(error, restaurant){
		restaurant.forEach(function(item, index){
			sum += item.stars;
		})
		return sum/restaurant.length;
	})
})
var Follow = mongoose.model('Follow', FollowsSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: Restaurant,
  Review: mongoose.model('Review', reviewSchema),
  Follow: Follow
};
