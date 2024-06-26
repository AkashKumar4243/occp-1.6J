import React, { useState, useEffect } from 'react';
import './App.css';
import OCPPClient from './occpClient';

function App() {
  const [response, setResponse] = useState('');
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ocppClient = new OCPPClient('ws://localhost:3001', 'EXAMPLE', ['ocpp1.6']);
    ocppClient.connect().then(() => {
      setClient(ocppClient);
      ocppClient.onMessage((message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }).catch(console.error);

    return () => {
      if (ocppClient) {
        ocppClient.close();
      }
    };
  }, []);

  const handleBootNotification = async () => {
    if (client && client.isConnected) {
      try {
        const bootResponse = await client.call('BootNotification', {
          chargePointVendor: "ocpp-rpc",
          chargePointModel: "ocpp-rpc",
        });

        if (bootResponse.status === 'Accepted') {
          setResponse('BootNotification accepted');
        } else {
          setResponse('BootNotification rejected');
        }
      } catch (error) {
        console.error('BootNotification error:', error);
      }
    }
  };

  const handleHeartbeat = async () => {
    if (client && client.isConnected) {
      try {
        const heartbeatResponse = await client.call('Heartbeat', {});
        setResponse(`Server time is: ${heartbeatResponse.currentTime}`);
      } catch (error) {
        console.error('Heartbeat error:', error);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>OCPP Client</h1>
        <button onClick={handleBootNotification}>BootNotification</button>
        <button onClick={handleHeartbeat}>Heartbeat</button>
        <p>{response}</p>
        <div className="messages">
          <h2>Messages:</h2>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{JSON.stringify(message)}</li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
