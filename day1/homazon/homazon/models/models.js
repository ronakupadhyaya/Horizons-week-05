import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';
var connect = process.env.MONGODB_URI;
var Schema = mongoose.Schema;

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

// Step 1: Write your schemas here!
// Remember: schemas are like your blueprint, and models
// are like your building!
// Models Schema
var userSchema = new Schema ({
  username: String,
  password: String
})
userSchema.plugin(findOrCreate);

// Create all of your models here, as properties.
var User = mongoose.model('User', userSchema);

export {User}
