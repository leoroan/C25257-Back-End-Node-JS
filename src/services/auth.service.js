import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

const API_URL = process.env.USER_API_URL;
const JWT_SECRET = process.env.JWT_SECRET;

export async function findUserByEmail(email) {
  const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
  const users = await res.json();
  return users.length > 0 ? new User(users[0]) : null;
}

export async function updateUserById(id, userData) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
}

export async function getUserById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return new User(data);
}

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Usuario no encontrado');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Credenciales inválidas');

  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username, cart: user.cart },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  return { token, user };
}

export async function registerUser({ username, email, password }) {
  const existing = await findUserByEmail(email);
  if (existing.ok) throw new Error('El usuario ya existe');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    username,
    email,
    password: hashedPassword,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
    cart: [],
    createdAt: new Date().toISOString()
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  });

  if (!res.ok) throw new Error('Error al crear el usuario');

  const data = await res.json();
  const user = new User(data);

  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  return { token, user };
}
