import { Router } from 'express';

// Crear una nueva instancia del enrutador de Express
const router = Router();

// --- Lógica de Rutas para /api/v1/productos ---

// GET /api/v1/productos
router.get('/', (req, res) => {
  // Aquí iría la lógica para obtener todos los productos de la base de datos
  res.status(200).json({
    message: 'Lista de productos (GET /productos)',
    data: [
      { id: 1, name: 'Producto A' },
      { id: 2, name: 'Producto B' }
    ]
  });
});

// GET /api/v1/productos/:id
router.get('/:id', (req, res) => {
  const productId = req.params.id;
  // Aquí iría la lógica para obtener un producto específico por ID
  res.status(200).json({
    message: `Detalle del producto ${productId} (GET /productos/:id)`,
    data: { id: productId, name: `Producto ${productId} encontrado` }
  });
});

// POST /api/v1/productos
router.post('/', (req, res) => {
  const newProduct = req.body;
  // Aquí iría la lógica para crear un nuevo producto
  res.status(201).json({
    message: 'Producto creado exitosamente (POST /productos)',
    data: newProduct
  });
});

// Exportar el enrutador para que pueda ser utilizado en app.js
export default router;