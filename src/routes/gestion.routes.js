// Importa Express para crear el router
const express = require('express');
// Crea un nuevo objeto Router de Express
const router = express.Router();

// Importa los controladores que manejarán la lógica de cada ruta
// Estos están en ../controllers/gestion.controller.js
const controller = require('../controllers/gestion.controller');

// Importa el middleware de validación que validará los datos de entrada
const validate = require('../middlewares/validate');

// Importa los esquemas de validación específicos para gestión
// createSchema = reglas para crear una nueva gestión
// updateSchema = reglas para actualizar una gestión existente
const { createSchema, updateSchema } = require('../validations/gestion.schema');

// --------------------------------------------------------------------
// DEFINE LAS RUTAS CRUD PARA EL RECURSO "GESTIONES"
// --------------------------------------------------------------------

// Ruta POST /gestiones → CREAR una nueva gestión
// 1. validate(createSchema) → Valida los datos del body con las reglas de creación
// 2. controller.create → Si pasa la validación, ejecuta el controlador de creación
router.post('/', validate(createSchema), controller.create);

// Ruta GET /gestiones → LISTAR todas las gestiones (con filtros opcionales)
// No necesita validación porque solo recibe parámetros de query (?page=1&limit=10...)
// controller.list → Maneja la paginación y filtros
router.get('/', controller.list);

// Ruta GET /gestiones/:id → OBTENER UNA gestión específica
// :id es un parámetro dinámico (ej: /gestiones/123 → id=123)
// controller.getById → Busca la gestión por ID
router.get('/:id', controller.getById);

// Ruta PUT /gestiones/:id → ACTUALIZACIÓN COMPLETA de una gestión
// 1. validate(updateSchema) → Valida los datos del body con reglas de actualización
// 2. controller.put → Si pasa validación, actualiza TODOS los campos
router.put('/:id', validate(updateSchema), controller.put);

// Ruta PATCH /gestiones/:id → ACTUALIZACIÓN PARCIAL de una gestión
// 1. validate(updateSchema) → Valida los datos del body (aunque sean parciales)
// 2. controller.patch → Actualiza solo los campos enviados
router.patch('/:id', validate(updateSchema), controller.patch); // ✅ CORREGIDO

// Ruta DELETE /gestiones/:id → ELIMINACIÓN LÓGICA (soft delete)
// No necesita validación porque solo recibe el ID
// controller.remove → Marca la gestión como "cerrada" en lugar de borrar
router.delete('/:id', controller.remove);

// --------------------------------------------------------------------
// EXPORTA EL ROUTER PARA QUE SEA USADO POR routes/index.js
// --------------------------------------------------------------------
module.exports = router;