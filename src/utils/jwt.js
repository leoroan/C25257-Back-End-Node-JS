import jwt from 'jsonwebtoken';

export const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const EXPIRATION_TIME = process.env.JWT_EXPIRES_IN + 'h' || '1h';

export const generateJWToken = (user) => {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: EXPIRATION_TIME })
}
