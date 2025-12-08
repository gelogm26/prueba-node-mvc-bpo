// Este archivo → Crea la conexión
// Modelos → Importan sequelize y definen tablas
// Controladores/Servicios → Usan los modelos para operaciones CRUD
// App principal → Inicia la conexión y sincroniza

const { Sequelize } = require('sequelize');
require('dotenv').config();

const {
    DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_DIALECT
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST || 'localhost',
    port: DB_PORT || 3306,
    dialect: DB_DIALECT || 'mysql',
    logging: false,
    define: {
        timestamps: true,
        freezeTableName: false
    }
});

module.exports = sequelize;
