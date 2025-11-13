# base node C25257-Back-End-Node-JS

# 🧩 API Backend con Express, Arquitectura por Capas y Autenticación JWT
---

## ⚙️ Estructura general del proyecto

```
📦 C25257-BACK-END-NOD-JS/
┣ 📄 .env
┗ 📂 src/
  ┣ 📄 app.js
  ┣ 📄 index.js
  ┣ 📂 controllers/
  ┣ 📂 services/
  ┣ 📂 models/
  ┣ 📂 routes/
  ┗ 📂 middleware/
```


---

## 🌍 Configuración de entorno (`.env` + dotenv)

**El archivo `.env` contiene variables esenciales:**

```env
PORT=8081
ENV_MODE=development
PRODUCT_API_URL=https://65ad277dadbd5aa31be03afc.mockapi.io/product
USER_API_URL=https://65ad277dadbd5aa31be03afc.mockapi.io/user
SESSION_COOKIE_VTO=3600000
JWT_SECRET=supersecreto123
```

📘 Conceptos aplicados:

- Uso de dotenv para cargar variables de entorno.
- Importación dinámica (await import()) para garantizar que .env se cargue antes de app.js.
- Separación de responsabilidades entre index.js (entrypoint) y app.js (configuración Express).

## 🧠 Arquitectura por capas

**“El código limpio no es el que más hace, sino el que mejor se entiende.”**

*El proyecto implementa la división lógica en capas:*
```
📂 models/     → define la estructura base de los datos (mock)
📂 services/   → maneja la lógica de negocio, requests HTTP (MockAPI)
📂 controllers/ → orquesta las peticiones/respuestas Express
📂 routes/      → define los endpoints REST
📂 middleware/  → seguridad, validaciones, autenticación JWT
```

Cada capa conoce solo lo necesario de la siguiente:
 - Routes → Controller → Service → Model.


## 🚀 Configuración del servidor (app.js)

Configuraciones clave aplicadas:

- Middleware de seguridad (helmet, cors, session, cookie-parser).
- CORS dinámico según entorno (ENV_MODE).
- Rutas versionadas (/api/v1/...).
- Manejadores de errores y 404 globales.
- Uso del patrón middleware para consistencia y testeo.

🧱 Conceptos:

- Middleware de manejo de errores.
- Módulo de sesiones con expiración dinámica.
- Rutas estructuradas por versión para mantener compatibilidad futura.

## 🧩 Consumo de API externa (MockAPI)
**Como no hay base de datos, el proyecto consume endpoints de MockAPI:**
```
const API_URL = process.env.PRODUCT_API_URL;
```
*Ejemplo de recurso*
```json
{
  "createdAt": "2025-11-11T14:41:14.649Z",
  "name": "Auriculares Bluetooth Pro",
  "description": "Auriculares inalámbricos con cancelación activa de ruido.",
  "price": "14999.90",
  "stock": 25,
  "image": "https://picsum.photos/seed/auriculares/400/300",
  "id": "1"
}
```

💡 Conceptos aplicados:

- Uso de fetch desde el Service Layer.
- Conversión de tipos (Number, parseFloat, Date).
- Encapsulación de la fuente de datos.

## 🔐 Autenticación con JWT y bcrypt
**Endpoints principales:**

- POST /auth/register → crea un nuevo usuario (mock)
- POST /auth/login → valida credenciales y emite un token JWT

*Flujo*:
- bcrypt.hash → encripta la contraseña antes de crear el usuario.
- bcrypt.compare → verifica contraseñas en login.
- jsonwebtoken.sign → genera un token seguro.
- Middleware JWT → protege rutas privadas.

**Ejemplo de payload JWT:**
```json
{
  "id": "1",
  "email": "lean@example.com",
  "username": "LeanCode",
  "iat": 1762965056,
  "exp": 1762972256
}
```

**Middleware de autenticación**
```js
const authHeader = req.headers.authorization;
if (!authHeader?.startsWith('Bearer ')) 
  return res.status(401).json({ message: 'Token ausente o inválido' });
```
**🔑 Conceptos aplicados:**
- Tokens portadores (Bearer Token).
- Seguridad sin estado (stateless auth).
- Validación de encabezados en req.headers.authorization.

## 🧪 Probando con Postman

- Login → copia el token devuelto.
- Nueva request → en Headers:
- `Authorization: Bearer <tu_token_jwt>`

**Si querés automatizarlo:**
- En la pestaña Authorization de Postman → Type: Bearer Token → pegá tu token.
- Postman inyecta el header automáticamente.


*Comandos:*
```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Iniciar en producción
npm start
```


**Made with ❤️ & clean code by Lean**


---
## Pre Entraga 
📝[`Pre-Entrega`](https://github.com/leoroan/C25257-Back-End-Node-JS/tree/Pre-Entrega)
