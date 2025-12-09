// Importa los operadores de Sequelize (para consultas complejas como LIKE, OR, etc.)
const { Op } = require('sequelize');
const { models } = require('../models');
const Gestion = models.Gestion;

// Recibe: objeto con datos de la gestión
// Retorna: la gestión creada en la BD
const create = async (data) => {
    const g = await Gestion.create(data);  // Crea el registro en la base de datos
    return g;  // Devuelve el objeto creado (con ID generado automáticamente)
};

// Recibe: id numérico de la gestión
// Retorna: la gestión encontrada o null si no existe
const getById = async (id) => {
    return Gestion.findByPk(id);
};

// Recibe: id de la gestión y objeto con datos a actualizar
// Retorna: la gestión actualizada o null si no existe
const update = async (id, data) => {
    const g = await Gestion.findByPk(id);  // 1. Busca la gestión por ID
    if (!g) return null;                   // 2. Si no existe, retorna null
    await g.update(data);                  // 3. Actualiza la gestión con los nuevos datos
    return g;                              // 4. Retorna la gestión actualizada
};

// Función para ACTUALIZACIÓN PARCIAL (actualiza solo algunos campos)
const partialUpdate = async (id, data) => update(id, data);

// Recibe: id de la gestión
// Retorna: la gestión actualizada o null si no existe
const softDelete = async (id) => {
    const g = await Gestion.findByPk(id);  // Busca la gestión
    if (!g) return null;                   // Si no existe, retorna null
    await g.update({ estado: 'cerrada' }); // Cambia solo el campo 'estado' a 'cerrada'
    return g;                              // Retorna la gestión actualizada
};

// Función para LISTAR gestiones con FILTROS y PAGINACIÓN
// Recibe: objeto query con parámetros de búsqueda
// Retorna: objeto con {data: arrayDeGestiones, meta: datosDePaginacion}
const list = async (query) => {
    // Extrae parámetros con valores por defecto
    const {
        page = 1,          // Página actual (default: 1)
        limit = 10,        // Límite por página (default: 10)
        q,                 // Texto para búsqueda general (opcional)
        tipificacion,      // Filtrar por tipo de gestión (opcional)
        asesorId,          // Filtrar por ID de asesor (opcional)
        desde, hasta       // Rango de fechas (opcional)
    } = query;

    // Calcula offset para paginación: cuántos registros saltar
    const offset = (page - 1) * limit;
    // Ejemplo: page=3, limit=10 → offset=20 (salta primeros 20 registros)
    // Construye objeto WHERE dinámicamente según los filtros proporcionados
    const where = {};

    // BÚSQUEDA GENERAL (texto libre en nombre o documento del cliente)
    if (q) {
        where[Op.or] = [  // Operador OR: busca en nombre O en documento
            { clienteNombre: { [Op.like]: `%${q}%` } },   // Nombre contiene 'q'
            { clienteDocumento: { [Op.like]: `%${q}%` } } // Documento contiene 'q'
        ];
    }

    // FILTROS ESPECÍFICOS
    if (tipificacion) where.tipificacion = tipificacion;  // Igual a tipificación específica
    if (asesorId) where.asesorId = asesorId;              // Igual a asesor específico

    // FILTRO POR RANGO DE FECHAS (createdAt)
    if (desde || hasta) {
        where.createdAt = {};  // Objeto para condiciones de fecha
        if (desde) where.createdAt[Op.gte] = new Date(desde);  // Mayor o igual que 'desde'
        if (hasta) where.createdAt[Op.lte] = new Date(hasta);  // Menor o igual que 'hasta'
    }

    // FILTRO POR ESTADO (por defecto solo gestiones abiertas)
    where.estado = { [Op.ne]: 'cerrada' };  // [Op.ne] = "not equal" (diferente de 'cerrada')

    // Ejecuta consulta CON PAGINACIÓN y CONTEO TOTAL
    const { count: total, rows } = await Gestion.findAndCountAll({
        where,              // Condiciones WHERE construidas arriba
        order: [['createdAt', 'DESC']],  // Ordena por fecha de creación descendente
        offset,             // Salto para paginación
        limit: parseInt(limit, 10)  // Límite convertido a número
    });

    // Calcula total de páginas
    const totalPages = Math.ceil(total / limit);

    // Retorna estructura estandarizada
    return {
        data: rows,  // Array de gestiones (filas obtenidas)
        meta: {      // Metadatos para paginación en frontend
            page: Number(page),      // Página actual
            limit: Number(limit),    // Límite por página
            total,                   // Total de registros (sin límite)
            totalPages               // Total de páginas disponibles
        }
    };
};

// Exporta todas las funciones como un objeto para usarlas en controladores
module.exports = {
    create,          // Crear gestión
    getById,         // Obtener por ID
    update,          // Actualizar completa
    partialUpdate,   // Actualizar parcial
    softDelete,      // Eliminación lógica
    list             // Listar con filtros y paginación
};