export const parseQuery = (queryString) => {
  const where = {};

  // Verifica si queryString existe y no está vacío
  if (!queryString || queryString.trim() === '') {
    return where;
  }

  // Divide la cadena en pares clave-valor
  const pairs = queryString.split(',');

  // Itera sobre cada par clave-valor
  pairs.forEach(pair => {
    const [key, value] = pair.split(':');
    
    if (key && value) {
      // Convierte el valor a un número si es necesario, de lo contrario lo deja como string
      where[key.trim()] = isNaN(value) ? value.trim() : Number(value);
    }
  });

  return where;
};