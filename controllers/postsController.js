import postScheme from '../schemes/postScheme.js';
import userScheme from '../schemes/userScheme.js';

export const createPost = async (req, res) => {
  try {
    const postUser = await userScheme.findOne({
      _id: req.userId,
    });
    const postDoc = new postScheme({
      name: postUser.name,
      title: req.body.title,
      text: req.body.text,
      image: req.body.image,
      user: req.userId,
    });

    const post = await postDoc.save();
    res.status(200).json({
      data: {
        ...post,
      },
      message: 'you have succesfull created your post',
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: 'unable to create the post',
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await postScheme.find();
    res.send(allPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      messege: 'unable to load posts',
    });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await postScheme.findById(postId);

    res.send(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      messege: 'unable to load post',
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await postScheme.deleteOne({
      _id: postId,
    });

    post.deletedCount
      ? res.send({ ...post, postId })
      : res.send('this post has already been deleted');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      messege: 'unable to remove post',
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await postScheme.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        image: req.body.image,
        user: req.userId,
      },
    );
    const updatedPost = await postScheme.findById(postId);
    res.send(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      messege: 'unable to update post',
    });
  }
};
