// Importa la librería Sequelize (las clases y funciones)
const Sequelize = require('sequelize');
// Importa la conexión configurada a la base de datos
const sequelize = require('../config/database');

// Crea un objeto central que contendrá todo lo relacionado con la base de datos
const db = {
    sequelize,      // La instancia de conexión activa a la BD
    Sequelize,      // La librería completa (DataTypes, operadores, etc.)
    models: {}      // Objeto para almacenar todos los modelos de la aplicación
};

// Importa y registra el modelo 'Gestion' en el objeto central
db.models.Gestion = require('./gestion.model')(sequelize, Sequelize);

// Exporta el objeto central para que toda la aplicación pueda usar:
// - db.sequelize → para operaciones directas de BD
// - db.Sequelize → para tipos de datos y operadores
// - db.models → para acceder a todos los modelos (ej: db.models.Gestion)
module.exports = db;