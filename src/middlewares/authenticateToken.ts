import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: string | object;
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!accessToken) {
    return res.sendStatus(401); // No access token, unauthorized
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) {
      return res.sendStatus(401); // Invalid or expired access token
    } else {
      // Access token is valid
      req.user = user;  // `user` now contains the decoded payload
      next();
    }
  });
};

export default authenticateToken;