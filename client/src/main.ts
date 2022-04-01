import './style.scss';
import Game from './Game';
import socket from './lib/socketio';
import loadImages from './lib/imageLoader';
// @ts-ignore
import bigImage from '../assets/reallybigimage.png';
// @ts-ignore
import otherImage from '../assets/otherbigimage.png';


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
// load images
const images = {
	big: bigImage,
	otherBig: otherImage,
};
loadImages(
	images,
	(loaded, total) => {
		console.log('loaded ', loaded, ' of ', total, 'bytes, or ', loaded / total * 100, '%');
	},
).then(() => {
	const game = new Game();
});