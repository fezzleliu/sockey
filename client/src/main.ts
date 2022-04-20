import './style.scss';
import './start.scss';
import Game from './Game';
import connect from './lib/socketio';
import loadImages from './lib/imageLoader';
// @ts-ignore
import redPlayer from '../assets/player_red.png';
// @ts-ignore
import bluePlayer from '../assets/player_blue.png';
import './start-screen';


// load images
const images = {
	redPlayer: redPlayer,
	bluePlayer: bluePlayer,
};
loadImages(
	images,
	(loaded, total) => {
		console.log('loaded ', loaded, ' of ', total, 'bytes, or ', loaded / total * 100, '%');
	},
).then(async (images) => {
	const socket = await connect();
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
	
	const game = new Game(images);
});