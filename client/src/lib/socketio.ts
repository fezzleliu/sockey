import io, { Socket } from "socket.io-client";

let socket: Socket;

function connect(): Promise<Socket> {
  return new Promise((resolve, reject) => {
    if (!socket) {
      socket = io(
				// @ts-ignore
        import.meta.env.DEV ? "http://localhost:8081" : "https://sockey-game.herokuapp.com"
      );
      socket.on("connect", () => {
        console.log("connected");
        resolve(socket);
      });
      socket.on("disconnect", () => {
        console.log("disconnected");
      });
    } else {
      resolve(socket);
    }
  });
}

export default connect;
export { socket };
