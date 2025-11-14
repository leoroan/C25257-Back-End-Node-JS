import * as PostService from '../services/post.service.js';

export const getPosts = async (req, res) => {
  try {
    const Post = await PostService.getAllPost();
    res.json(Post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const Post = await PostService.getPostById(req.params.id);
    res.json(Post);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const newPost = await PostService.createPost(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const updatedPost = await PostService.updatePost(req.params.id, req.body);
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const result = await PostService.deletePost(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
