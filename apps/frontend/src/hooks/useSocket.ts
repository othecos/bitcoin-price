import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.IO client
    const socketInstance = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    );

    setSocket(socketInstance);

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
}
