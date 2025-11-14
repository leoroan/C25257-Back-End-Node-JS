import Post from '../models/post.model.js';

const API_URL = process.env.POST_API_URL;

export const getAllPosts = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener los Posts');
  const data = await res.json();
  return data.map(post => new Post(post));
};

export const getPostById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Post no encontrado');
  const data = await res.json();
  return new Post(data);
};

export const createPost = async (PostData) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(PostData),
  });
  if (!res.ok) throw new Error('Error al crear Post');
  let data;
  try {
    data = await res.json();
  } catch {
    data = PostData; 
  }
  return new Post(data);
};

export const updatePost = async (id, PostData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(PostData),
  });
  if (!res.ok) throw new Error('Error al actualizar el Post');
  const data = await res.json();
  return new Post(data);
};

export const deletePost = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar el Post');
  return { message: `Post ${id} eliminado correctamente` };
};
