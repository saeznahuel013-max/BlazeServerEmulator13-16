const express = require('express');
const app = express();
// Railway nos da un puerto, pero internamente usamos el 80 si es posible
const port = process.env.PORT || 80;

app.use((req, res, next) => {
    const host = req.headers.host || '';
    
    // Si la petición va a Sony, logueamos pero no bloqueamos
    if (host.includes('playstation') || host.includes('sony') || host.includes('scea')) {
        console.log(`[PASARELA PSN] Redirigiendo tráfico de Sony: ${host}`);
        // Respondemos 200 OK para que la PS3 crea que la conexión es exitosa
        return res.status(200).send('OK');
    }
    
    console.log(`[FIFA] Petición detectada: ${req.method} ${req.url}`);
    next();
});

// Simulador de conexión para la PS3
app.get(['/generate_204', '/connectivity-check.html', '/ncs'], (req, res) => {
    res.status(204).send();
});

// Redireccionador Blaze (FIFA 15)
app.get('/redirector/getServer', (req, res) => {
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?><server><hostname>${req.headers.host}</hostname><port>80</port><use-ssl>false</use-ssl></server>`);
});

// Evitar error de "Servidores Cerrados"
app.all(['/status', '/available', '/info.txt'], (req, res) => {
    res.send('AVAILABLE=1\nMAINTENANCE=0\nIS_ONLINE=1');
});

// Respuesta por defecto para todo lo demás
app.all('*', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor Invisible Online en puerto ${port}`);
});
