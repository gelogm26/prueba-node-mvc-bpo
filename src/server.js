const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API BPO funcionando correctamente ✅');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
