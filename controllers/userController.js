import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import bcrypt, { genSalt } from 'bcrypt';
import UserSchema from '../schemes/userScheme.js';
import userScheme from '../schemes/userScheme.js';

dotenv.config();

const tokenKey = process.env.TOKEN_KEY;

export const register = async (req, res) => {
  try {
    const userIExist = await UserSchema.findOne({ email: req.body.email });
    if (userIExist) {
      return res.json({
        message: 'email is already registered',
        status: 400,
      });
    }

    const asignedPassword = req.body.password;
    const saltHashAlgorythm = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(asignedPassword, saltHashAlgorythm);

    const userDoc = new UserSchema({
      email: req.body.email,
      password: passwordHashed,
      name: req.body.name,
      avatar: req.body.avatar,
    });

    const user = await userDoc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      tokenKey,
      {
        expiresIn: '14d',
      },
    );

    const { password, createdAt, updatedAt, __v, ...userData } = user._doc;

    res.json({ ...userData, message: 'success', token });
  } catch (err) {
    res.json({
      message: 'wrong authication',
    });
  }
};
export const login = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        message: 'you are not registered yet',
        status: 400,
      });
    }

    const userPassword = await bcrypt.compare(req.body.password, user._doc.password);
    if (!userPassword) {
      return res.json({
        message: 'password or login are wrong',
        status: 400,
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      tokenKey,
      {
        expiresIn: '14d',
      },
    );

    const { password, createdAt, updatedAt, __v, ...userData } = user._doc;

    res.json({ ...userData, message: 'success', token });
  } catch (err) {
    console.log(err);
    res.json({
      message: 'unable to log in',
    });
  }
};
export const getMe = async (req, res) => {
  const loggedUser = await userScheme.findById(req.userId);

  const { password, __v, ...rest } = loggedUser._doc;

  res.json({
    ...rest,
    status: 200,
  });
};
