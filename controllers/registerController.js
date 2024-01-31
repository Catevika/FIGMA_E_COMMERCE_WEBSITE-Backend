import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

export const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) return res.status(400).json({ 'message': 'All fields are required' });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate) {
    return res.status(409).json({ 'message': 'Conflict with existing credentials!' });
  }

  try {
    //encrypt the password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create and store the new user
    const newUser = await User.create({ name, username, email, password: hashedPassword });
    console.log({ 'newUser': newUser });

    res.status(201).json({ 'success': `New user ${username} created!` });
  } catch (err) {
    res.status(500).json({ 'message': err.message });
  }
};