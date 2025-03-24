import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5008/gameHub", {
    skipNegotiation: true, 
    transport: signalR.HttpTransportType.WebSockets,
  })
  .withAutomaticReconnect([0, 2000, 5000, 10000]) 
  .configureLogging(signalR.LogLevel.Information)
  .build();

const startConnection = async () => {
  try {
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      await connection.start();
      console.log("✅ SignalR Connected!");
    }
  } catch (err) {
    console.error("❌ SignalR Connection Failed:", err);
    setTimeout(startConnection, 5000); // Retry after 5 seconds
  }
};

// // Listen for connection state changes
// connection.onreconnecting((error) => {
//   console.warn("⚠️ SignalR Reconnecting...", error);
// });

// connection.onreconnected((connectionId) => {
//   console.log("🔄 SignalR Reconnected!", connectionId);
// });

// connection.onclose(async () => {
//   console.warn("⚠️ SignalR Disconnected. Retrying...");
//   await startConnection();
// });

export { connection, startConnection };
