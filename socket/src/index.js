export default function setupSockets(io) {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Example event: Listening for messages
    socket.on("sendMessage", (data) => {
      console.log("Message received:", data);
      io.emit("receiveMessage", data); // Broadcast message to all clients
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
