import { validationResult } from 'express-validator';

export const handleValidationErr = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(errors.array());
  }

  next();
};
