import jwt from 'jsonwebtoken';

export function jwtAuth(strict = true) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;    
    if (!authHeader?.startsWith('Bearer ')) {
      if (!strict) return next(); 
      return res.status(401).json({ error: true, message: 'Token requerido' });
    }
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      res.status(403).json({ error: true, message: 'Token inválido o expirado' });
    }
  };
}

