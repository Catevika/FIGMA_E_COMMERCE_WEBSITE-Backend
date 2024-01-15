import bcrypt from 'bcrypt';
import ash from 'express-async-handler';
import User from '../models/userModel.js';

export const registerUser = ash(async (req, res) => {
  const { name, username, email, password } = req.body;

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username });
  if (duplicate) {
    return res.status(409).json({ 'message': 'Conflict with existing credentials!' });
  }

  //encrypt the password;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create and store the new user
  const newUser = new User({ name, username, email, password: hashedPassword });
  const user = await newUser.save();

  console.log(user);

  res.status(201).json({ 'success': `New user ${username} created!` });
});