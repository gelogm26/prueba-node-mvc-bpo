// validación de los datos que vienen del schema para generar error (a partir de lo que ya definió Joi)
module.exports = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        return res.status(400).json({ message: 'Validation error', details: error.details.map(d => d.message) });
    }
    req.body = value;
    next();
};
