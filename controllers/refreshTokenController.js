import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401);
  const refreshToken = cookies.jwt;
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

  const user = await User.findOne({ refreshToken });

  // Detected refresh token reuse!
  if (!user) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_KEY,
      async (err, decoded) => {
        if (err) return res.status(403); //Forbidden
        // Delete refresh tokens of hacked user
        const hackedUser = await User.findOne({ username: decoded.username });
        hackedUser.refreshToken = [];
        await hackedUser.save();
      }
    );
    return res.status(403); //Forbidden
  }

  const newRefreshTokenArray = user.refreshToken.filter(rt => rt !== refreshToken);

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_KEY,
    async (err, decoded) => {
      if (err) {
        // expired refresh token
        user.refreshToken = [ ...newRefreshTokenArray ];
        await user.save();
      }
      if (err || user.username !== decoded.username) return res.status(403);

      // Refresh token was still valid
      const accessToken = jwt.sign(
        {
          username: decoded.username,
          id: decoded.id
        },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: '10s' }
      );

      const newRefreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_KEY,
        { expiresIn: '15s' }
      );
      // Saving refreshToken with current user
      user.refreshToken = [ ...newRefreshTokenArray, newRefreshToken ];
      await user.save();

      // Creates Secure Cookie with refresh token
      res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

      res.json({ accessToken });
    }
  );
};