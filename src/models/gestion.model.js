// Este archivo define el modelo "Gestion"
// Recibe dos parámetros inyectados por models/index.js:
// sequelize: la conexión a la BD
// DataTypes: los tipos de datos disponibles (STRING, INTEGER, ENUM, etc.)

module.exports = (sequelize, DataTypes) => {
    const Gestion = sequelize.define('Gestion', {
        
        id: {
            type: DataTypes.INTEGER.UNSIGNED,  
            autoIncrement: true,                
            primaryKey: true                    
        },

        clienteDocumento: {
            type: DataTypes.STRING,             
            allowNull: false                    
        },

        clienteNombre: {
            type: DataTypes.STRING,
            allowNull: false                    
        },

        asesorId: {
            type: DataTypes.STRING,
            allowNull: false                    // OBLIGATORIO
        },

        // CAMPO: tipificacion - Categoría principal de la gestión
        tipificacion: {
            type: DataTypes.ENUM(               
                'Contacto Efectivo',              
                'No Contacto',                    
                'Promesa de Pago',                
                'Pago Realizado',                 
                'Refinanciación',                 
                'Información',                    
                'Escalamiento',                   
                'Otros'                           
            ),
            allowNull: false                    
        },

        subtipificacion: {
            type: DataTypes.STRING,
            allowNull: true                     // OPCIONAL (puede ser NULL)
        },

        canalOficial: {
            type: DataTypes.BOOLEAN,            
            allowNull: false,
            defaultValue: true                  
        },

        valorCompromiso: {
            type: DataTypes.DECIMAL(12, 2),      // Número decimal (12 dígitos, 2 decimales)
            allowNull: true,                    // OPCIONAL
            validate: { min: 0 }                // Validación: mínimo 0 (no negativo)
        },

        // CAMPO: fechaCompromiso - Fecha acordada para algo (ej: pago)
        fechaCompromiso: {
            type: DataTypes.DATEONLY,           // Solo fecha (sin hora)
            allowNull: true                     // OPCIONAL
        },


        observaciones: {
            type: DataTypes.TEXT,               // Texto largo (más de 255 caracteres)
            allowNull: true                     
        },

        // CAMPO: recordingUrl - URL de grabación de la llamada (si aplica)
        recordingUrl: {
            type: DataTypes.STRING,
            allowNull: true                    
        },

        // CAMPO: estado - Estado actual de la gestión
        estado: {
            type: DataTypes.ENUM('abierta', 'cerrada'),  // Solo dos valores posibles
            allowNull: false,
            defaultValue: 'abierta'             // Valor por defecto: 'abierta'
        }
    },
        {
            tableName: 'gestiones',              // Nombre real de la tabla en BD
            indexes: [                           // Índices para optimizar búsquedas
                { fields: ['clienteDocumento'] },  // Índice por documento del cliente
                { fields: ['asesorId'] },          // Índice por asesor
                { fields: ['tipificacion'] }       // Índice por tipo de gestión
            ]
            // NOTA: timestamps: true está implícito (createdAt, updatedAt automáticos)
        });

    // Retorna el modelo definido para que models/index.js lo registre
    return Gestion;
};