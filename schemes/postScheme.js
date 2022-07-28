import mongoose from 'mongoose';

const postScheme = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String || null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('post', postScheme);
