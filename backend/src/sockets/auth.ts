import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

interface DecodedToken {
  id: string;
  role: Role;
}

export const socketAuthMiddleware = (socket: Socket, next: (err?: any) => void) => {
  const auth = socket.handshake.auth || {};
  const token = auth.token;
  const deviceToken = auth.deviceToken;

  if (deviceToken) {
    // Electron agent connection - authorized via device token
    socket.data.role = "AGENT";
    socket.data.deviceToken = deviceToken;
    socket.data.computerId = auth.computerId || socket.handshake.query?.computerId;
    return next();
  }

  if (!token) {
    return next(new Error("Authentication error: Token is required"));
  }

  const secret = process.env.JWT_ACCESS_SECRET!;

  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    socket.data.userId = decoded.id;
    socket.data.role = decoded.role;
    return next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
};
