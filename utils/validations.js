import { body } from 'express-validator';

export const registerValidator = [
  body('email', "You've entered wrong email format").isEmail(),
  body('password', 'password has to have at least 5 characters').isLength({ min: 5 }),
  body('name', 'name should contain at least 3 charachters').isLength({ min: 3 }),
];

export const loginValidator = [
  body('email', "You've entered wrong email format").isEmail(),
  body('password', 'password has to have at least 5 characters').isLength({ min: 5 }),
];

export const postValidator = [
  body('title', 'title should have at least 1 chatacter').isLength({ min: 1 }).isString(),
  body('text', 'length of your text should be at least 5 characters')
    .isLength({ min: 5 })
    .isString(),
];
