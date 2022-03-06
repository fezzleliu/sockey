import io from 'socket.io-client';

const socket = io(import.meta.env.DEV ? 'http://localhost:8081' : 'https://sockey.fezzle.dev');

socket.on('connect', () => {
	console.log('connected to server');
});

export default socket;