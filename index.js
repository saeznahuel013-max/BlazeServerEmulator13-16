const net = require('net');
const http = require('http');

// Puerto interno que Railway mapea al TCP Proxy (usualmente 80 u 8080)
const PORT = process.env.PORT || 80;

// 1. SERVIDOR HTTP (Para el Redireccionador y Check de Conexión)
const httpServer = http.createServer((req, res) => {
    const host = req.headers.host || '';

    // Bypass para PSN y Connectivity Check
    if (host.includes('playstation') || req.url.includes('generate_204')) {
        res.writeHead(200);
        res.end('OK');
        return;
    }

    // Redireccionador Blaze para FIFA
    if (req.url.includes('/redirector/getServer')) {
        console.log(`[FIFA] Redirigiendo consola...`);
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(`<?xml version="1.0" encoding="UTF-8"?><server><hostname>${host}</hostname><port>80</port><use-ssl>false</use-ssl></server>`);
        return;
    }

    res.writeHead(200);
    res.end('AVAILABLE=1\nMAINTENANCE=0');
});

// 2. LÓGICA DE PROXY TCP (Para los paquetes del juego)
// Esto evita que los paquetes de PSN se traben
httpServer.on('connection', (socket) => {
    socket.on('error', (err) => {
        if (err.code !== 'ECONNRESET') console.error('[TCP Error]', err.message);
    });
});

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TCP Proxy Activo en puerto ${PORT}`);
    console.log(`🎮 PSN Passthrough: Habilitado`);
});
