import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error("XATO: JWT_ACCESS_SECRET va JWT_REFRESH_SECRET .env faylida sozlanishi shart!");
  process.exit(1);
}


import http from "http";
import { Server } from "socket.io";
import app from "./app";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client ulandi");
});

server.listen(PORT, () => {
  console.log(`Server ${PORT} da ishga tushdi`);
});
