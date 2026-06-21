import { Server } from "socket.io";

let ioInstance: Server | null = null;

export const setIo = (io: Server): void => {
  ioInstance = io;
};

export const getIo = (): Server => {
  if (!ioInstance) {
    throw new Error("Socket.io instance has not been initialized yet!");
  }
  return ioInstance;
};
