import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "./auth";

// In-memory set to track online computers
export const onlinePCs = new Set<string>();

// Track disconnect timeouts to handle temporary disconnects gracefully
const disconnectTimeouts = new Map<string, NodeJS.Timeout>();

export const registerSocketHandlers = (io: Server) => {
  // Apply token/auth middleware
  io.use(socketAuthMiddleware);

  io.on("connection", (socket: Socket) => {
    const role = socket.data.role;
    const userId = socket.data.userId;
    const deviceToken = socket.data.deviceToken;
    const computerId = socket.data.computerId;

    if (role === "ADMIN") {
      socket.join("admin-room");
      console.log(`Admin (User ID: ${userId}) joined admin-room.`);
    }

    if (deviceToken && computerId) {
      // Clear any pending offline transitions for this computer
      const existingTimeout = disconnectTimeouts.get(computerId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        disconnectTimeouts.delete(computerId);
      }

      socket.join(`pc-${computerId}`);
      onlinePCs.add(computerId);
      console.log(`Electron agent connected for computer ID: ${computerId}. Computer is online.`);
    }

    // Heartbeat from Electron agent
    socket.on("pc:heartbeat", () => {
      if (computerId) {
        // Clear any pending offline transition
        const existingTimeout = disconnectTimeouts.get(computerId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
          disconnectTimeouts.delete(computerId);
        }

        onlinePCs.add(computerId);
        console.log(`Heartbeat received from computer: ${computerId}`);
      }
    });

    // Handle order creation placeholder (Phase 5)
    socket.on("order:new", (data: any) => {
      console.log("Placeholder received order:new event with data:", data);
      // This will be fully implemented in Phase 5
    });

    socket.on("disconnect", () => {
      if (deviceToken && computerId) {
        console.log(`Electron agent for computer: ${computerId} disconnected. Waiting to confirm offline status...`);
        
        // Don't mark offline immediately. Wait 45 seconds to tolerate brief network dropouts.
        const timeout = setTimeout(() => {
          onlinePCs.delete(computerId);
          disconnectTimeouts.delete(computerId);
          console.log(`Computer: ${computerId} confirmed offline after timeout.`);
        }, 45 * 1000);

        disconnectTimeouts.set(computerId, timeout);
      } else {
        console.log(`Client disconnected. Role: ${role || "Unknown"}`);
      }
    });
  });
};
