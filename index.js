const express = require('express');
const app = express();
const port = process.env.PORT || 80;

// LOG MAESTRO: Para ver cada movimiento de la PS3
app.use((req, res, next) => {
    console.log(`[CONEXIÓN] ${req.method} en ${req.url}`);
    console.log(`[HEADERS] ${JSON.stringify(req.headers)}`);
    next();
});

// 1. REDIRECCIONADOR (Blaze)
// Engaña al juego para que piense que este es el servidor oficial
app.get('/redirector/getServer', (req, res) => {
    console.log("--> Enviando a la PS3 hacia nuestro servidor");
    res.send(`
        <server>
            <hostname>${process.env.RAILWAY_STATIC_URL || 'localhost'}</hostname>
            <port>80</port>
            <use-ssl>false</use-ssl>
        </server>
    `);
});

// 2. CHECK DE DISPONIBILIDAD (Evita el error de "Servidores Cerrados")
app.get(['/status', '/info.txt', '/available'], (req, res) => {
    res.send('AVAILABLE=1\nMAINTENANCE=0\nIS_ONLINE=1\nVERSION=1.0');
});

// 3. RESPUESTA UNIVERSAL
// Si el juego busca cualquier otra cosa, le decimos que estamos aquí
app.all('*', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`SERVIDOR FIFA REVIVAL ONLINE EN PUERTO ${port}`);
    console.log(`URL: ${process.env.RAILWAY_STATIC_URL || 'Esperando URL...'}`);
    console.log(`=========================================`);
});
