import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
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
  refreshToken: [ String ]
},
  { timestamps: true });

const User = mongoose.model('Users', UserSchema);


export default User;
