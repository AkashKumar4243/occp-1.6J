const express = require('express');
const http = require('http');
const { RPCServer, RPCClient } = require('./index'); // Adjust the path if necessary

const app = express();
const server = http.createServer(app);

const rpcServer = new RPCServer({
    protocols: ['ocpp1.6'], // server accepts ocpp1.6 subprotocol
    strictMode: true,       // enable strict validation of requests & responses
});

server.on('upgrade', rpcServer.handleUpgrade);

rpcServer.on('client', (client) => {
    console.log(`Client connected: ${client.identity}`);
    
    client.handle('Heartbeat', ({ params }) => {
        console.log('Received Heartbeat from client:', params);
        return { currentTime: new Date().toISOString() };
    });
});

// Start the Express server on port 3001
server.listen(3001, () => {
    console.log('Express server listening on port 3001');
});

// Create a simple client to connect to the server
const cli = new RPCClient({
    endpoint: 'ws://localhost:3001',
    identity: 'XYZ123',
    protocols: ['ocpp1.6'],
    strictMode: true,
});

(async () => {
    await cli.connect();
    
    // Send a Heartbeat request and log the response
    const response = await cli.call('Heartbeat', {});
    console.log('Server responded to Heartbeat with:', response);
})();
