const express = require('express');
const path = require('path');
const cors = require('cors');
const { RPCServer, createRPCError } = require('ocpp-rpc');
const createClient = require('./client');

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Parse JSON bodies
app.use(express.json());

// OCPP Server setup
const ocppServer = new RPCServer({
    protocols: ['ocpp1.6'], // server accepts ocpp1.6 subprotocol
    strictMode: true,       // enable strict validation of requests & responses
});

ocppServer.auth((accept, reject, handshake) => {
    accept({ sessionId: 'XYZ123' });
});

ocppServer.on('client', async (client) => {
    console.log(`${client.session.sessionId} connected!`); // `XYZ123 connected!`

    client.handle('Authorize', ({ params }) => {
        console.log(`Server got Authorize from ${client.identity}:`, params);
        return { idTagInfo: { status: "Accepted" } };
    });

    client.handle('BootNotification', ({ params }) => {
        console.log(`Server got BootNotification from ${client.identity}:`, params);
        return { status: "Accepted", interval: 300, currentTime: new Date().toISOString() };
    });

    client.handle('DataTransfer', ({ params }) => {
        console.log(`Server got DataTransfer from ${client.identity}:`, params);
        return { status: "Accepted", data: "Sample Data" };
    });

    client.handle('DiagnosticsStatusNotification', ({ params }) => {
        console.log(`Server got DiagnosticsStatusNotification from ${client.identity}:`, params);
        return {};
    });

    client.handle('FirmwareStatusNotification', ({ params }) => {
        console.log(`Server got FirmwareStatusNotification from ${client.identity}:`, params);
        return {};
    });

    client.handle('Heartbeat', () => {
        return { currentTime: new Date().toISOString() };
    });

    client.handle('MeterValues', ({ params }) => {
        console.log(`Server got MeterValues from ${client.identity}:`, params);
        return {};
    });

    client.handle('StartTransaction', ({ params }) => {
        console.log(`Server got StartTransaction from ${client.identity}:`, params);
        return { transactionId: 12345, idTagInfo: { status: "Accepted" } };
    });

    client.handle('StatusNotification', ({ params }) => {
        console.log(`Server got StatusNotification from ${client.identity}:`, params);
        return {};
    });

    client.handle('StopTransaction', ({ params }) => {
        console.log(`Server got StopTransaction from ${client.identity}:`, params);
        return { idTagInfo: { status: "Accepted" } };
    });

    client.handle(({ method, params }) => {
        console.log(`Server got ${method} from ${client.identity}:`, params);
        throw createRPCError("NotImplemented");
    });
});

// Start the OCPP server
ocppServer.listen(3000).then(() => {
    console.log('OCPP server running on ws://localhost:3000');
});

// Function to handle OCPP requests
async function handleOcppRequest(type) {
    const cli = await createClient();

    switch (type) {
        case 'Authorize':
            return await cli.call('Authorize', { idTag: "ABC123" });
        case 'BootNotification':
            return await cli.call('BootNotification', { chargePointVendor: "ocpp-rpc", chargePointModel: "ocpp-rpc" });
        case 'DataTransfer':
            return await cli.call('DataTransfer', { vendorId: "VendorX", messageId: "MessageY", data: "Sample Data" });
        case 'DiagnosticsStatusNotification':
            return await cli.call('DiagnosticsStatusNotification', { status: "Idle" });
        case 'FirmwareStatusNotification':
            return await cli.call('FirmwareStatusNotification', { status: "Downloaded" });
        case 'Heartbeat':
            return await cli.call('Heartbeat', {});
        case 'MeterValues':
            return await cli.call('MeterValues', {
                connectorId: 1,
                transactionId: 12345,
                meterValue: [{ timestamp: new Date().toISOString(), sampledValue: [{ value: "20.0", unit: "Wh" }] }]
            });
        case 'StartTransaction':
            return await cli.call('StartTransaction', {
                connectorId: 1,
                idTag: "ABC123",
                timestamp: new Date().toISOString(),
                meterStart: 0
            });
        case 'StatusNotification':
            return await cli.call('StatusNotification', { connectorId: 1, status: "Available", errorCode: "NoError" });
        case 'StopTransaction':
            return await cli.call('StopTransaction', {
                transactionId: 12345,
                idTag: "ABC123",
                timestamp: new Date().toISOString(),
                meterStop: 20.0
            });
        default:
            throw new Error('Unknown request type');
    }
}

// Handle OCPP request from the web interface
app.post('/ocpp-request', (req, res) => {
    const { type } = req.body;
    handleOcppRequest(type)
        .then(response => res.json({ status: 'success', response }))
        .catch(error => res.json({ status: 'error', error: error.message }));
});

// Start the web server
app.listen(port, () => {
    console.log(`Web server running at http://localhost:${port}`);
});
