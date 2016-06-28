//     this.model('Follow').findOne({
//       follower: this._id,
//       followed: idToFollow
//     }), function(err, pair){
//         if(!err && pair === null){
//             var n = new Follow({
//                 follower: this._id,
//                 followed:idToFollow
//             });
//             n.save(function(error){
//                 if(error){ callback(error); }
//             });
//         } else if(err){
//             callback(err);
//         } else { callback(pair); }
//     }
//
// }



//get follows
//  this.model('follow').find({ //this refers to the user that's calling it --> the model
//   followed: id
// });
// .populate('follower')
// .exec(function(err, myFollowers){
//     //do another find function to find all the people who we follow
//     Follow.find({
//         follower:id
//     })
//     .populate('followed')
//     .exec(function(err, myFollowed){
//       callback(err, myFollowers, myFollowed)
//     })
// }
// )
// }
