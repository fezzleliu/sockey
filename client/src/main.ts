import './style.css';
import socket from './socketio';
import Game from './Game';

const canvas = document.createElement('canvas');

canvas.innerHTML = 'Your browser does not support html canvas';

document.body.appendChild(canvas);

const game = new Game();