// Este archivo define las REGLAS DE VALIDACIÓN para los datos de gestión
// Usa Joi, una librería para validar datos en Node.js
const Joi = require('joi');

const tipificaciones = [
    'Contacto Efectivo', 'No Contacto', 'Promesa de Pago', 'Pago Realizado',
    'Refinanciación', 'Información', 'Escalamiento', 'Otros'
];

const createSchema = Joi.object({
    clienteDocumento: Joi.string().required(),
    clienteNombre: Joi.string().required(),
    asesorId: Joi.string().required(),
    tipificacion: Joi.string().valid(...tipificaciones).required(),
    subtipificacion: Joi.string().allow('', null),
    canalOficial: Joi.boolean().default(true),
    valorCompromiso: Joi.number().min(0).precision(2).optional(),
    fechaCompromiso: Joi.date().iso().optional(),
    observaciones: Joi.string().max(1000).allow('', null),
    recordingUrl: Joi.string().uri().allow('', null)
});

const updateSchema = createSchema.optionalKeys(
    'clienteDocumento', 'clienteNombre', 'asesorId', 'tipificacion'
);

module.exports = { createSchema, updateSchema, tipificaciones };
