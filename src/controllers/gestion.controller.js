// Importa el archivo de servicios que contiene toda la lógica de negocio
const service = require('../services/gestion.service');

// async = Esta función tendrá operaciones que toman tiempo (como acceder a la BD)
const create = async (req, res, next) => {
    try { // Intenta ejecutar este bloque de código
        // req.body = Los datos JSON que el cliente envió en la petición
        const result = await service.create(req.body);
        res.status(201).json(result);

    } catch (err) { // Si ocurre CUALQUIER error en el try, se ejecuta esto
        // next(err) = Pasa el error al siguiente middleware (error.handler.js)
        next(err);
    }
};

const list = async (req, res, next) => {
    try {
        const result = await service.list(req.query);
        res.json(result);

    } catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        // req.params.id = El valor de :id en la URL (/gestiones/123 → id=123)
        const g = await service.getById(req.params.id);

        // Si el servicio devuelve null (no encontró la gestión)
        if (!g) return res.status(404).json({ message: 'No encontrado' });
        res.json(g);
    } catch (err) {
        next(err);
    }
};

// PUT reemplaza TODO el recurso, debe enviarse todos los campos
const put = async (req, res, next) => {
    try {
        // Actualiza la gestión usando los datos completos del body
        const g = await service.update(req.params.id, req.body);

        // Si no existe la gestión a actualizar
        if (!g) return res.status(404).json({ message: 'No encontrado' });

        // Devuelve la gestión actualizada
        res.json(g);

    } catch (err) {
        next(err);
    }
};

// Controlador para ACTUALIZACIÓN PARCIAL (PATCH /gestiones/:id)
// PATCH actualiza solo los campos enviados, no requiere todos
const patch = async (req, res, next) => {
    try {
        const g = await service.partialUpdate(req.params.id, req.body);

        if (!g) return res.status(404).json({ message: 'No encontrado' });

        res.json(g);

    } catch (err) {
        next(err);
    }
};

// En realidad es un "soft delete" - no borra físicamente, solo marca como cerrada (cambio de estado)
const remove = async (req, res, next) => {
    try {
        const g = await service.softDelete(req.params.id);

        if (!g) return res.status(404).json({ message: 'No encontrado' });

        // Confirma la operación con mensaje descriptivo
        res.json({ message: 'Gestión marcada como cerrada' });

    } catch (err) {
        next(err);
    }
};

// Exporta todos los controladores como un objeto
// Esto permite importarlos en las rutas así:
// const { create, list, getById } = require('./controllers/gestion.controller');
module.exports = {
    create,   // POST    /gestiones
    list,     // GET     /gestiones
    getById,  // GET     /gestiones/:id
    put,      // PUT     /gestiones/:id  (actualización completa)
    patch,    // PATCH   /gestiones/:id  (actualización parcial)
    remove    // DELETE  /gestiones/:id  (soft delete)
};