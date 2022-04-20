import createModal from './lib/modal';
import './start.scss';
// @ts-ignore
import playerBlue from '../assets/player_blue.png';
// @ts-ignore
import playerRed from '../assets/player_red.png';
import { format } from 'path';

document.querySelector('.outer .btns .btn.how').addEventListener('click', () => {
	const modal = createModal('How to play', 'just know');
	document.querySelector('.start-outer').appendChild(modal);
});

document.querySelector('.outer .btns .btn.about').addEventListener('click', () => {
	const modal = createModal('About this game', 'made by joshua liu');
	document.querySelector('.start-outer').appendChild(modal);
});

const players: Array<string | HTMLImageElement> = ['player_blue', 'player_red'];

document.querySelector('.outer .players').append(...players.map(player => {
	const img = new Image(28, 35);
	img.src = player === 'player_blue' ? playerBlue : playerRed;
	return img;
}));