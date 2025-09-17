# 🌟 Pre-Entrega de Proyecto

## 📋 Requerimientos del Proyecto

---

### 1️⃣ Configuración Inicial

- Crea un directorio para tu proyecto e incluye un archivo `index.js` como punto de entrada.
- Inicia Node.js y configura npm con:
  ```bash
  npm init -y
  ```
- Agrega la propiedad `"type": "module"` en el archivo `package.json` para habilitar ESModules.
- Configura un script llamado `start` para ejecutar el programa:
  ```json
  "scripts": {
    "start": "node index.js"
  }
  ```
  Ejecuta con:
  ```bash
  npm run start
  ```

---

### 2️⃣ Lógica de Gestión de Productos

Utiliza la API FakeStore para implementar las siguientes funcionalidades. El sistema debe interpretar comandos en la terminal:

#### 🔍 Consultar Todos los Productos

- Ejecuta:
  ```bash
  npm run start GET products
  ```
- El programa realiza una petición asíncrona a la API y muestra la lista completa de productos.

#### 🔎 Consultar un Producto Específico

- Ejecuta:
  ```bash
  npm run start GET products/<productId>
  ```
- El programa obtiene y muestra el producto correspondiente al `productId`.

#### ➕ Crear un Producto Nuevo

- Ejecuta:
  ```bash
  npm run start POST products <title> <price> <category>
  ```
- El programa envía una petición POST para agregar un nuevo producto y muestra el resultado.

#### 🗑️ Eliminar un Producto

- Ejecuta:
  ```bash
  npm run start DELETE products/<productId>
  ```
- El programa envía una petición DELETE y muestra la respuesta.

---

## 💡 Tips de Desarrollo

- Usa `process.argv` para capturar y procesar los comandos.
- Implementa `fetch` para interactuar con la API FakeStore.
- Aprovecha destructuring y spread para manipular datos.
- Utiliza métodos de arrays y strings para separar y procesar información.

---

> ¡Organiza tu código y aprovecha las herramientas modernas de JavaScript para una solución eficiente y elegante! 🚀
