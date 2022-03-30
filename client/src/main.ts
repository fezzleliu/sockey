import './style.scss';
import Game from './Game';
import socket from './socketio';

const game = new Game();

// @ts-ignore
if (import.meta.env.DEV) {
	socket.on('reload', () => {
		location.reload();
	});

	window.addEventListener('keydown', ({ key }) => {
		if (key === 'r') {
			socket.emit('reload');
		}
	});
}