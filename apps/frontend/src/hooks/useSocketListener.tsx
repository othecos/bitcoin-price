import { useEffect } from "react";
import { Socket } from "socket.io-client";

export enum SocketChannels {
  BITCOIN_PRICE_UPDATE = "bitcoin:price-update",
}

export const useSocketListener = (
  socket: Socket | null,
  channel: SocketChannels,
  callback: (...args: any[]) => void,
) => {
  useEffect(() => {
    if (socket) {
      // Listen for real-time price updates
      socket.on(channel, (data) => {
        callback(data);
      });

      return () => {
        socket.off(channel);
      };
    }
  }, [socket]);
};
