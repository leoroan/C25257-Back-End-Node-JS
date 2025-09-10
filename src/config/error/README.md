# Manejo de Errores en Aplicaciones Node.js con Express y Sequelize

Este documento describe cómo estructurar y manejar los errores en una aplicación Node.js usando una arquitectura por capas. La idea es tener mensajes de error descriptivos y trazabilidad tanto para el desarrollador (logs en consola) como para el cliente (respuestas JSON), manteniendo el código limpio y fácil de depurar.

---

## Índice

1. [Introducción](#introducción)
2. [Estructura de la Arquitectura](#estructura-de-la-arquitectura)
3. [Tipos de Errores y Cuándo Usarlos](#tipos-de-errores-y-cuándo-usarlos)
4. [Implementación de CustomError](#implementación-de-customerror)
5. [Manejo de Errores en Cada Capa](#manejo-de-errores-en-cada-capa)
   - [DAO (Data Access Object)](#dao-data-access-object)
   - [Service](#service)
   - [Controller](#controller)
   - [Middleware de Errores](#middleware-de-errores)
6. [Buenas Prácticas](#buenas-prácticas)
7. [Ejemplo Completo de Uso](#ejemplo-completo-de-uso)
8. [Conclusiones](#conclusiones)

---

## Introducción

El manejo de errores es fundamental para construir aplicaciones robustas. La idea es:

- **Proveer información útil:** Tanto para el desarrollador (en logs) como para el cliente (respuesta estructurada).
- **Mantener la trazabilidad:** Para saber en qué capa se originó el error.
- **Transformar y propagar errores:** Cada capa se encarga de transformar errores específicos a un formato consistente.

---

## Estructura de la Arquitectura

La aplicación se divide en las siguientes capas:

1. **DAO (Data Access Object):** Se comunica directamente con la base de datos. Aquí se capturan y transforman los errores de Sequelize.
2. **Service:** Contiene la lógica de negocio. Aquí se puede validar la información y transformar errores según la lógica.
3. **Controller:** Se encarga de recibir las peticiones HTTP, invocar los servicios correspondientes y enviar la respuesta.
4. **Middleware de Errores:** Captura los errores propagados desde cualquier capa y genera una respuesta JSON consistente. Además, registra los errores con Winston.

---

## Tipos de Errores y Cuándo Usarlos

### Errores 4xx (Errores del Cliente)

- **BadRequest (400):** Cuando la petición es incorrecta o faltan datos requeridos.
- **Unauthorized (401):** Cuando el usuario no está autenticado.
- **Forbidden (403):** Cuando el usuario no tiene permisos para acceder al recurso.
- **NotFound (404):** Cuando no se encuentra el recurso solicitado.
- **Conflict (409):** Por conflictos, como violaciones de restricciones de unicidad.

### Errores 5xx (Errores del Servidor)

- **InternalServerError (500):** Error genérico del servidor.
- **ServiceUnavailable (503):** Cuando no se puede conectar con la base de datos o algún servicio externo.
- **GatewayTimeout (504):** Cuando se excede el tiempo de espera en una petición a un servicio externo.

### Uso por Capas

- **DAO:** Aquí se capturan errores de la base de datos, como errores de validación o de conexión (ej., `SequelizeValidationError`, `SequelizeUniqueConstraintError`). Se transforman usando un helper como `SequelizeError.handleSequelizeError`.
- **Service:** Aquí se puede validar si los resultados cumplen la lógica de negocio. Si no, se lanza un error, por ejemplo, `NotFound` si no se encontraron registros.
- **Controller:** No se debe transformar o interpretar errores. Su única responsabilidad es atrapar errores y pasarlos al middleware de errores usando `next(error)`.
- **Middleware de Errores:** Centraliza el manejo de errores, estructurando la respuesta y registrando la información (logs) de manera uniforme.

---

## Implementación de CustomError

### Archivo: `customError.js`

Este archivo define la clase `CustomError` que extiende de `Error` para capturar el `stack` y tener propiedades adicionales como `statusCode`, `code`, `details` y `timestamp`.

```js
import createError from 'http-errors';

class CustomError extends Error {
  constructor(statusCode, message, options = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = options.code || 'UNDEFINED_ERROR';
    this.details = options.details || null;
    this.expose = options.expose ?? statusCode < 500;
    this.timestamp = new Date().toISOString();
    this.stack = options.originalError?.stack || new Error().stack;
  }

  static create(statusCode, message, options = {}) {
    return new CustomError(statusCode, message, options);
  }
}

export default CustomError;
```

# Manejo de Errores en Cada Capa

## DAO (Data Access Object)

Aquí se ejecuta la consulta a la base de datos y se transforman los errores de Sequelize:

```js
async findAll() { 
  try {
    const records = await this.model.findAll();
    if (!records || records.length === 0) {
      throw new Error(`${this.model.name} no encontrado`);
    }
    return records;
  } catch (error) {
    // Transforma el error usando un helper para errores de Sequelize
    throw SequelizeError.handleSequelizeError(error, `Buscando ${this.model.name}`);
  }
}
```

**Nota:** Si la consulta no devuelve registros, puedes optar por devolver un array vacío o lanzar un error, según tu lógica de negocio.

---

## Service

El service invoca al DAO y añade lógica de negocio. Por ejemplo, si no se encontraron registros, se lanza un error específico:

```js
async findAll(data) {
  try {
    const all = await this.repository.findAll(data);
    if (!all || all.length === 0) {
      throw new NotFound('Nada encontrado en la base de datos');
    }
    return all;
  } catch (error) {
    // Opcional: loguear en nivel debug
    devLogger.debug(error);
    throw error;
  }
}
```

---

## Controller

El controller recibe la petición, llama al service y maneja el error pasando el control al middleware. Es muy importante que la función incluya `next` como tercer parámetro:

```js
async findAll(req, res, next) {
  try {
    const { scope, page, pageSize, query } = req.query;
    const records = await this.service.findAll({ scope, page, pageSize, query });
    return res.sendSuccess(records);
  } catch (error) {
    devLogger.error(error);
    next(error);  // Propaga el error al middleware de errores
  }
}
```

**Importante:**

- Si no se incluye `next` en la firma del controller, Express no lo inyectará y se producirá el error `"next is not a function"`.
- En el router, asegúrate de pasar correctamente la función, por ejemplo:

```js
router.get('/usuarios', (req, res, next) => UsuarioController.findAll(req, res, next));
```

---

## Middleware de Errores

El middleware de errores centraliza la respuesta y el registro de errores:

```js
import { devLogger } from "../config/logger/logger.config.js";
import CustomError from '../config/error/customError.js';
import { SequelizeError } from '../config/error/errors.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Si el error proviene de Sequelize, se transforma
  if (error.name?.startsWith('Sequelize')) {
    error = SequelizeError.handleSequelizeError(error);
  }

  // Si el error no es una instancia de CustomError, se transforma a un error interno
  if (!(error instanceof CustomError)) {
    error = new CustomError(500, 'Internal Server Error', {
      originalError: error,
      expose: false
    });
  }

  // Respuesta estructurada para el cliente
  res.status(error.statusCode).json({
    status: 'Error',
    code: error.code,
    message: error.expose ? error.message : 'Internal Server Error',
    details: error.details || undefined,
    timestamp: error.timestamp
  });

  // Registro estructurado con Winston
  const logLevel = error.statusCode >= 500 ? 'error' : 'warn';
  devLogger[logLevel]({
    type: 'Error',
    code: error.code,
    statusCode: error.statusCode,
    message: error.message,
    details: error.details,
    stack: error.stack
  });
};

export default errorHandler;
```

---

## Buenas Prácticas

### Centralización del manejo de errores:
- Usa un middleware de errores para que todas las respuestas tengan el mismo formato y evita duplicar la lógica de manejo en cada controller.

### No repetir logs:
- Trata de no registrar el mismo error en varias capas. Por ejemplo, si ya se logueó en el middleware, en las capas inferiores puedes usar niveles de log como `debug`.

### Uso adecuado de tipos de error:
- Utiliza errores **4xx** para problemas de validación, permisos o recursos inexistentes.
- Emplea errores **5xx** para problemas en la comunicación con la base de datos o errores inesperados en el servidor.

### Mantenimiento de la trazabilidad:
- Incluye información como `stack` y `timestamp` para facilitar la depuración y seguimiento del error.

---

## Ejemplo Completo de Uso

### 1. En el DAO
```js
// dao/usuario.dao.js
async findAll() { 
  try {
    const usuarios = await this.model.findAll();
    if (!usuarios || usuarios.length === 0) {
      throw new Error(`${this.model.name} no encontrado`);
    }
    return usuarios;
  } catch (error) {
    throw SequelizeError.handleSequelizeError(error, `Buscando ${this.model.name}`);
  }
}
```

### 2. En el Service
```js
// services/usuario.service.js
async findAll(data) {
  try {
    const usuarios = await this.repository.findAll(data);
    if (!usuarios || usuarios.length === 0) {
      throw new NotFound('Nada encontrado en la base de datos');
    }
    return usuarios;
  } catch (error) {
    devLogger.debug(error);
    throw error;
  }
}
```

### 3. En el Controller
```js
// controllers/usuario.controller.js
async findAll(req, res, next) {
  try {
    const { scope, page, pageSize, query } = req.query;
    const usuarios = await this.service.findAll({ scope, page, pageSize, query });
    return res.sendSuccess(usuarios);
  } catch (error) {
    devLogger.error(error);
    next(error);
  }
}
```

### 4. En el Router
```js
// routes/usuario.routes.js
import { Router } from 'express';
import UsuarioController from '../controllers/usuario.controller.js';

const router = Router();

router.get('/usuarios', (req, res, next) => UsuarioController.findAll(req, res, next));

export default router;
```

### 5. En el Middleware de Errores
```js
// middlewares/errorHandler.js
import { devLogger } from "../config/logger/logger.config.js";
import CustomError from '../config/error/customError.js';
import { SequelizeError } from '../config/error/errors.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (error.name?.startsWith('Sequelize')) {
    error = SequelizeError.handleSequelizeError(error);
  }

  if (!(error instanceof CustomError)) {
    error = new CustomError(500, 'Internal Server Error', {
      originalError: error,
      expose: false
    });
  }

  res.status(error.statusCode).json({
    status: 'Error',
    code: error.code,
    message: error.expose ? error.message : 'Internal Server Error',
    details: error.details || undefined,
    timestamp: error.timestamp
  });

  const logLevel = error.statusCode >= 500 ? 'error' : 'warn';
  devLogger[logLevel]({
    type: 'Error',
    code: error.code,
    statusCode: error.statusCode,
    message: error.message,
    details: error.details,
    stack: error.stack
  });
};

export default errorHandler;
```

---

## Conclusiones

Cada capa tiene su responsabilidad:
- El DAO transforma errores de base de datos, el Service añade lógica de negocio, y el Controller se encarga de la interacción HTTP.

**Centralización y consistencia:**
- El middleware de errores se encarga de estructurar la respuesta y registrar errores de forma uniforme.

**Claridad y trazabilidad:**
- Gracias a la implementación de `CustomError`, se dispone de mensajes descriptivos, códigos de error y trazabilidad mediante `stack` y `timestamp`.

Esta guía te ayudará a no olvidar cómo estructurar el manejo de errores en tus aplicaciones y te servirá de referencia para futuras mejoras o revisiones.
```
