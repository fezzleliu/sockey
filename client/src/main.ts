import './style.css';
import socket from './socketio';

const canvas = document.createElement('canvas');

canvas.innerHTML = 'Your browser does not support html canvas';

document.body.appendChild(canvas);

socket.on('connect', () => {
	console.log('yay');
});