const args = process.argv.slice(2);
const [metodo, end_point, ...rest] = args;
const validMethods = ["GET", "POST", "PUT", "DELETE"];

const method = metodo?.toUpperCase();
const endpoint = end_point?.trim() || "";

if (!validMethods.includes(method)) {
  console.log('\x1b[31mMétodo HTTP NO soportado o NO encontrado.\x1b[0m, Por favor, usá uno de los siguientes métodos:');
  console.log('\x1b[33mMétodos soportados:\x1b[0m \x1b[32m' + validMethods.join(', ') + '\x1b[0m, \x1b[33m(Podés copiar y pegar en la consola)\x1b[0m');
  console.log('\x1b[36mEJEMPLO:\x1b[0m node index.js \x1b[32mGET\x1b[0m products');
  console.log('\x1b[36mEJEMPLO:\x1b[0m node index.js \x1b[32mPOST\x1b[0m products "Nuevo Producto" 99.99 "electronics" "Descripción del producto" "https://imagen.com/img.jpg"');
  console.log('\x1b[36mEJEMPLO:\x1b[0m node index.js \x1b[32mPUT\x1b[0m products/1 "Producto Editado" 79.99 "jewelery" "Descripción editada" "https://imagen.com/edit.jpg"');
  console.log('\x1b[36mEJEMPLO:\x1b[0m node index.js \x1b[32mDELETE\x1b[0m products/1');
  process.exit(1);
}

if (!endpoint) {
  console.log(`\x1b[31mSeleccionaste el método\x1b[0m \x1b[32m${method}\x1b[0m, \x1b[31mpero te faltó un endpoint. Por favor, proporcioná uno para continuar...\x1b[0m`);
  console.log("\x1b[33m(agregalo después del método HTTP)\x1b[0m");
  console.log("\x1b[36mEjemplos de endpoints:\x1b[0m");
  console.log(`\x1b[36m node index.js \x1b[32m${method}\x1b[0m products\x1b[0m`);
  console.log(`\x1b[36m node index.js \x1b[32m${method}\x1b[0m carts\x1b[0m`);
  console.log(`\x1b[36m node index.js \x1b[32m${method}\x1b[0m users\x1b[0m`);
  process.exit(1);
}

const url = `https://fakestoreapi.com/${endpoint}`;

let product = {};
if (["POST", "PUT"].includes(method)) {
  const [título, precio, descripción, categoría, imagen] = rest.map(str => str?.trim());
  if (título) product.title = título;
  if (precio) product.price = parseFloat(precio);
  if (descripción) product.description = descripción;
  if (categoría) product.category = categoría;
  if (imagen) product.image = imagen;
}

const fetchOptions = {
  POST: {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  },
  PUT: {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  },
  DELETE: { method: "DELETE" }
};

const handleResponse = response => response.json().then(data => console.log(data));

switch (method) {
  case "GET":
    fetch(url)
      .then(handleResponse)
      .catch(console.error);
    break;
  case "POST":
  case "PUT":
  case "DELETE":
    fetch(url, fetchOptions[method])
      .then(handleResponse)
      .catch(console.error);
    break;
}
