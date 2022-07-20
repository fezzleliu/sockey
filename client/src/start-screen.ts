import createModal from './lib/modal';
import './start.scss';
// @ts-ignore
import playerBlue from '../assets/player_blue.png';
// @ts-ignore
import playerRed from '../assets/player_red.png';

document.querySelector('.outer .btns .btn.how').addEventListener('click', () => {
	const modal = createModal('How to play', `
On a computer, hold down the the mouse and drag to move. Hold the space bar to charge the ball, and release to shoot.<br>
On a touchscreen device, use the joystick to move. Hold the arrow button to charge the ball, and release to shoot.
`);
	document.querySelector('.start-outer').appendChild(modal);
});

document.querySelector('.outer .btns .btn.about').addEventListener('click', () => {
	const modal = createModal('About this game', 'Sockey is an open source game created by Joshua Liu. It was built with TypeScript and Socket.io, with development and build with Vite.');
	document.querySelector('.start-outer').appendChild(modal);
});

const players: Array<string | HTMLImageElement> = ['player_blue', 'player_red'];

document.querySelector('.outer .players').append(...players.map(player => {
	const img = new Image(28, 35);
	img.src = player === 'player_blue' ? playerBlue : playerRed;
	return img;
}));