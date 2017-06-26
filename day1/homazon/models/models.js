import mongoose from 'mongoose';

var Schema = mongoose.Schema;

// define schemas here
var UserSchema = new Schema({
  username: String,
  password: String
});



// define models here
var User = mongoose.model('User', UserSchema);




// export here
export {User};
