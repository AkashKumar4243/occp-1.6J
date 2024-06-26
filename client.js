// const { RPCClient } = require('ocpp-rpc');

// const cli = new RPCClient({
//     endpoint: 'ws://localhost:3000', // the OCPP endpoint URL
//     identity: 'EXAMPLE',             // the OCPP identity
//     protocols: ['ocpp1.6'],          // client understands ocpp1.6 subprotocol
//     strictMode: true,                // enable strict validation of requests & responses
// });

// cli.connect().then(async () => {
//     console.log('Client connected to server');

//     // Send Authorize request
//     const authorizeResponse = await cli.call('Authorize', {
//         idTag: "ABC123"
//     });
//     console.log('Authorize response:', authorizeResponse);

//     // Send BootNotification request
//     const bootResponse = await cli.call('BootNotification', {
//         chargePointVendor: "ocpp-rpc",
//         chargePointModel: "ocpp-rpc",
//     });
//     console.log('BootNotification response:', bootResponse);

//     // Send DataTransfer request
//     const dataTransferResponse = await cli.call('DataTransfer', {
//         vendorId: "VendorX",
//         messageId: "MessageY",
//         data: "Sample Data"
//     });
//     console.log('DataTransfer response:', dataTransferResponse);

//     // Send DiagnosticsStatusNotification request
//     const diagnosticsStatusResponse = await cli.call('DiagnosticsStatusNotification', {
//         status: "Idle"
//     });
//     console.log('DiagnosticsStatusNotification response:', diagnosticsStatusResponse);

//     // Send FirmwareStatusNotification request
//     const firmwareStatusResponse = await cli.call('FirmwareStatusNotification', {
//         status: "Downloaded"
//     });
//     console.log('FirmwareStatusNotification response:', firmwareStatusResponse);

//     // Send Heartbeat request
//     const heartbeatResponse = await cli.call('Heartbeat', {});
//     console.log('Heartbeat response:', heartbeatResponse);

//     // Send MeterValues request
//     const meterValuesResponse = await cli.call('MeterValues', {
//         connectorId: 1,
//         transactionId: 12345,
//         meterValue: [
//             {
//                 timestamp: new Date().toISOString(),
//                 sampledValue: [
//                     { value: "20.0", unit: "Wh" }
//                 ]
//             }
//         ]
//     });
//     console.log('MeterValues response:', meterValuesResponse);

//     // Send StartTransaction request
//     const startTransactionResponse = await cli.call('StartTransaction', {
//         connectorId: 1,
//         idTag: "ABC123",
//         timestamp: new Date().toISOString(),
//         meterStart: 0
//     });
//     console.log('StartTransaction response:', startTransactionResponse);

//     // Send StatusNotification request
//     const statusNotificationResponse = await cli.call('StatusNotification', {
//         connectorId: 1,
//         status: "Available",
//         errorCode: "NoError"
//     });
//     console.log('StatusNotification response:', statusNotificationResponse);

//     // Send StopTransaction request
//     const stopTransactionResponse = await cli.call('StopTransaction', {
//         transactionId: 12345,
//         idTag: "ABC123",
//         timestamp: new Date().toISOString(),
//         meterStop: 20.0
//     });
//     console.log('StopTransaction response:', stopTransactionResponse);

// }).catch(error => {
//     console.error('Client connection error:', error);
// });


const { RPCClient } = require('ocpp-rpc');

async function createClient() {
    const cli = new RPCClient({
        endpoint: 'ws://localhost:3000', // the OCPP endpoint URL
        identity: 'EXAMPLE',             // the OCPP identity
        protocols: ['ocpp1.6'],          // client understands ocpp1.6 subprotocol
        strictMode: true,                // enable strict validation of requests & responses
    });

    try {
        await cli.connect();
        console.log('Client connected to server');
        return cli;
    } catch (error) {
        console.error('Client connection error:', error);
        throw error;
    }
}

module.exports = createClient;

