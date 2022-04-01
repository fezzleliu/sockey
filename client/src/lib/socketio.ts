import io, { Socket } from 'socket.io-client';

// @ts-ignore
let socket: null | Socket = null;

function connect(): Promise<Socket> {
	return new Promise((resolve, reject) => {
		if (socket === null) {
			// @ts-ignore
			socket = io(import.meta.env.DEV ? 'http://localhost:8081' : location.href);
			socket.on('connect', () => {
				console.log('connected');
				resolve(socket);
			});
			socket.on('disconnect', () => {
				console.log('disconnected');
			});
		} else {
			resolve(socket);
		}
	});
}

export default connect;
export { socket };