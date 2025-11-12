import Product from '../models/product.model.js';

const API_URL = process.env.PRODUCT_API_URL;

export const getAllProducts = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener productos');
  const data = await res.json();
  return data.map(prod => new Product(prod));
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Producto no encontrado');
  const data = await res.json();
  return new Product(data);
};

export const createProduct = async (productData) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error('Error al crear producto');
  let data;
  try {
    data = await res.json();
  } catch {
    data = productData; // fallback
  }
  return new Product(data);
};

export const updateProduct = async (id, productData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error('Error al actualizar producto');
  const data = await res.json();
  return new Product(data);
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar producto');
  return { message: `Producto ${id} eliminado correctamente` };
};
