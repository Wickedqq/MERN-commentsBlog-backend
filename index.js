import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';

import { registerValidator, loginValidator, postValidator } from './utils/validations.js';
import { handleValidationErr } from './utils/handleValidationErr.js';

import tokenCheker from './utils/tokenChecker.js';
import { register, login, getMe } from './controllers/userController.js';
import { createPost, deletePost, getAllPosts, updatePost } from './controllers/postsController.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT;
const connectionString = process.env.DB_CONNECTION_STRING;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log(`DB is OK`);
  })
  .catch((err) => {
    console.log('err', err);
  });

const storageDetails = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imageUploader = multer({ storage: storageDetails });

app.post(`/authicate/register`, registerValidator, handleValidationErr, register);
app.post('/authicate/login', loginValidator, handleValidationErr, login);
app.get('/me', tokenCheker, getMe);

app.get('/posts', getAllPosts);
app.post('/posts', tokenCheker, postValidator, handleValidationErr, createPost);
app.patch('/posts/:id', tokenCheker, postValidator, handleValidationErr, updatePost);
app.delete('/posts/:id', tokenCheker, deletePost);

app.post('/uploads', imageUploader.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(PORT || 3030, (err) => {
  if (err) {
    console.log("server isn't working");
    return console.log(err);
  }
  console.log(`Server is OK`);
});
