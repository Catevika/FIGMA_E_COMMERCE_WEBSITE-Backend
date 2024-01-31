import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [ true, 'Name is required' ]
  },
  username: {
    type: String,
    required: [ true, 'Username is required' ],
    unique: [ true, 'This username already exists, make sure it is unique' ]
  },
  email: {
    type: String,
    required: [ true, 'Email is required' ],
  },
  password: {
    type: String,
    required: [ true, 'Password is required' ],
  },
  refreshToken: [ String ]
},
  { timestamps: true });

const User = mongoose.model('Users', UserSchema);


export default User;
