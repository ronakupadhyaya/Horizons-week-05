import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

export default User;
