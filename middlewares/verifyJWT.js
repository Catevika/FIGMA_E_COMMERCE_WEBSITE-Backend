import jwt from 'jsonwebtoken';

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  const token = authHeader.split(' ')[ 1 ];
  console.log(token);
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_KEY,
    (err, decoded) => {
      if (err) return res.sendStatus(403); //invalid token
      req.username = decoded.username;
      req.password = decoded.password;
      next();
    }
  );
};