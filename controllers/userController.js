import bcrypt from 'bcrypt';
import User from '../models/userModel.js';


export const getAllUsers = async (req, res) => {
  const users = await User.find().exec();
  if (!users) return res.status(204).json({ 'message': 'No user found' });
  res.status(200).json(users);
};

export const deleteUser = async (req, res) => {
  if (!req?.params?.username) return res.status(400).json({ "message": 'Username required' });
  const foundUser = await User.findOne({ username: req.params.username }).exec();
  if (!foundUser) {
    return res.status(204).json({ 'message': `User ${req.params.username} not found` });
  }
  await User.deleteOne({ username: req.params.username }).exec();
  res.status(200).json({ 'message': `User ${req.params.username} deleted` });
};

export const getUserDetails = async (req, res) => {
  if (!req?.params?.username) return res.status(400).json({ "message": 'Username required' });
  const foundUser = await User.findOne({ username: req.params.username }).exec();
  if (!foundUser) {
    return res.status(204).json({ 'message': `User ${req.params.username} not found` });
  }
  res.status(200).json(foundUser);
};

export const updateUser = async (req, res) => {
  if (!req?.params?.username) return res.status(400).json({ "message": 'Username required' });

  const foundUser = await User.findOne({ username: req.params.username }).exec();
  if (!foundUser) {
    return res.status(404).json({ 'message': `User ${req.params.username} not found` });
  }

  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    res.status(403).json({ 'message': 'Form not filled out correctly' });
  }
  // check if old password is correct
  const oldMatch = await bcrypt.compare(oldPassword, foundUser.password);
  if (!oldMatch) {
    res.status(403).json({ 'message': 'Old password does not match' });
  }

  // check if new password is the same as confirm password
  if (newPassword !== confirmPassword) {
    res.status(403).json({ 'message': 'New and confirm passwords do not match' });
  }

  //check if new password is the same as old password
  const newMatch = await bcrypt.compare(confirmPassword, foundUser.password);
  if (newMatch) {
    res.status(403).json({ 'message': 'New password must be different from old password' });
  }

  // if all of the above is correct, encrypt the new password;
  const newSalt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(confirmPassword, newSalt);

  // save new hashed password in the database
  foundUser.password = hashedNewPassword;
  await foundUser.save();
  res.status(200).json(foundUser);
};

