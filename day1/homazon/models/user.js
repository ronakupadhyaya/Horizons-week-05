import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI);
const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin']
  }
});

const User = mongoose.model('User', UserSchema);

export default User;
