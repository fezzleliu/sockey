import socket from './socketio';

// define interfaces

// inital data from server
interface InitData {
	board: {
		width: number,
		height: number,
		goalHeight: number,
	},
	players: number,
}

class Game {
	
	data: InitData

	constructor() {
		console.log('game initalizing');

		this.data = {
			board: {
				width: 0,
				height: 0,
				goalHeight: 0,
			},
			players: 10,
		}
		
		socket.on('people', this.onPerson.bind(this));

	}

	onPerson(people: number) {
		document.getElementById('waiting').innerHTML = `${people}/${this.data.players} joined`;
	}
}

export default Game;