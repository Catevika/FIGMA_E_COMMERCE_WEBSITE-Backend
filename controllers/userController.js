import ash from 'express-async-handler';
import User from '../models/userModel.js';

export const getAllUsers = ash(async (req, res) => {
  const users = await User.find().exec();
  if (!users) return res.status(204).json({ 'message': 'No users found' });
  res.json(users);
});

export const deleteUser = ash(async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
  }
  const result = await user.deleteOne({ _id: req.body.id }).exec();
  res.json(result);
});

export const getUser = ash(async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
  }
  res.json(user);
});

