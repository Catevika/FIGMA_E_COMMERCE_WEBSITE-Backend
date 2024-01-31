import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401);
  const refreshToken = cookies.jwt;
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

  const foundUser = await User.findOne({ refreshToken }).exec();

  // Detected refreshToken reuse!
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_KEY,
      async (err, decoded) => {
        if (err) return res.status(403); //Forbidden
        // Delete refreshTokens of hacked user
        const hackedUser = await User.findOne({ username: decoded.username }).exec();
        hackedUser.refreshToken = [];
        await hackedUser.save();
      }
    );
    return res.status(403); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_KEY,
    async (err, decoded) => {
      if (err) {
        // expired refreshToken
        foundUser.refreshToken = [ ...newRefreshTokenArray ];
        await foundUser.save();
      }

      if (err || foundUser.username !== decoded.username) return res.status(403);

      // refreshToken was still valid
      const accessToken = jwt.sign(
        {
          username: decoded.username
        },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: '10s' }
      );

      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_KEY,
        { expiresIn: '15s' }
      );
      // Saving refreshToken with current user
      foundUser.refreshToken = [ ...newRefreshTokenArray, newRefreshToken ];
      await foundUser.save();

      // Creates Secure Cookie with refreshToken
      res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

      res.json({ accessToken });
    }
  );
};