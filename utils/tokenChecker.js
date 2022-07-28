import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const tokenKey = process.env.TOKEN_KEY;

export default (req, res, next) => {
  let token = req.headers.authorization;

  if (token) {
    token = token.replace('Bearer ', '');
    try {
      const decodedJWT = jwt.verify(token, tokenKey);
      req.userId = decodedJWT._id;

      next();
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: 'token is wrong',
      });
    }
  } else {
    return res.json({
      status: 500,
      message: 'auth token have not been provided',
    });
  }
};
