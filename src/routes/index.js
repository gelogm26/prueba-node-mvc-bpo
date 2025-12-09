// Importa Express para crear rutas
const express = require('express');
// Crea un objeto router de Express
const router = express.Router();

// Monta todas las rutas de gestión bajo el path '/gestiones'
router.use('/gestiones', require('./gestion.routes'));

// Exporta el router para usarlo en app.js
module.exports = router;