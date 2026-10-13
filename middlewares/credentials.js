import { isAllowedOrigin } from '../config/allowedOrigins.js';

export const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
};