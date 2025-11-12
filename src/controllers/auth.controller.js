import * as authService from '../services/auth.service.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: true, message: 'Email y password son requeridos' });

    const { token, user } = await authService.loginUser(email, password);

    res.status(200).json({
      message: 'Login exitoso',
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (err) {
    res.status(401).json({ error: true, message: err.message });
  }
}

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: true, message: 'Faltan campos requeridos' });

    const { token, user } = await authService.registerUser({ username, email, password });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: { id: user.id, username: user.username, email: user.email },
      // token
    });
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
}

export async function logout(req, res) {
  res.status(200).json({ message: 'Logout exitoso' });
} 