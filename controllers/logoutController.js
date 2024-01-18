import User from '../models/userModel.js';

export const logoutUser = async (req, res) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.status(204).json('User logged out successfully');
  }

  // Delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);;
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.status(204).json('User logged out successfully');
};