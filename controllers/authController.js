import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Login user with password
export const loginUser = async (req, res) => {
  const cookies = req.cookies;

  if (!req.body.username || !req.body.password) return res.status(400).json('Username and password are required.');

  const foundUser = await User.findOne({ username: req.body.username }).exec();

  if (!foundUser) return res.sendStatus(401);

  const match = await bcrypt.compare(req.body.password, foundUser.password);

  if (!match) res.status(401).json('Not authorized');

  // create JWTs
  const accessToken = jwt.sign(
    { 'username': foundUser.username },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: '10s' }
  );

  const newRefreshToken = jwt.sign(
    { 'username': foundUser.username },
    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: '1d' }
  );

  let newRefreshTokenArray =
    !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

  if (cookies?.jwt) {
    /*
    Scenario:
        1) User logs in but never uses refreshToken and does not logout
        2) refreshToken is stolen
        3) If 1 & 2, reuse detection is needed to clear all refreshTokens when user logs in
    */
    const refreshToken = cookies.jwt;
    const foundToken = await User.findOne({ refreshToken }).exec();

    // Detected refreshToken reuse!
    if (!foundToken) {
      // clear out ALL previous refreshTokens
      newRefreshTokenArray = [];
    }

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  }

  // Saving refreshToken with current user
  foundUser.refreshToken = [ ...newRefreshTokenArray, newRefreshToken ];
  await foundUser.save();

  // Creates Secure Cookie with refreshToken
  res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

  // Send authorization roles and access token to user
  res.json({ accessToken });
};