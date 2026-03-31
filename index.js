const express = require('express');
const app = express();
const port = process.env.PORT || 80;

// CONFIGURACIÓN DE URL
const MY_URL = process.env.RAILWAY_STATIC_URL || 'tu-url.up.railway.app';

app.use((req, res, next) => {
    // Log para ver si la PS3 está intentando conectar a PSN a través del proxy
    if (req.hostname.includes('playstation') || req.hostname.includes('scea')) {
        console.log(`[PSN BYPASS] Dejando pasar tráfico de Sony: ${req.hostname}`);
    } else {
        console.log(`[FIFA DATA] Petición: ${req.method} ${req.url}`);
    }
    next();
});

// 1. SIMULADOR DE DISPONIBILIDAD (Evita error de servidores cerrados)
app.get(['/status', '/available', '/info.txt', '/ps3/check'], (req, res) => {
    res.send('AVAILABLE=1\nMAINTENANCE=0\nIS_ONLINE=1\nSTATE=ACTIVE');
});

// 2. REDIRECCIONADOR BLAZE (Para que el FIFA encuentre tu server)
app.get('/redirector/getServer', (req, res) => {
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <server>
            <hostname>${MY_URL}</hostname>
            <port>80</port>
            <use-ssl>false</use-ssl>
        </server>`);
});

// 3. COMPATIBILIDAD CON PSN (Respuesta básica para evitar errores de conexión)
app.get('/connectivity-check.html', (req, res) => {
    res.status(200).send('OK');
});

// 4. RESPUESTA UNIVERSAL 200 (Para que la consola no crea que no hay internet)
app.all('*', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`✅ SERVIDOR MAESTRO ONLINE`);
    console.log(`🔗 URL: ${MY_URL}`);
    console.log(`🎮 PSN Bypass: ACTIVADO`);
});
