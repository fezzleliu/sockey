import { range } from 'lodash-es';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import Player from './Player';
import Constants from './Constants';

class Game {
	players: Player[]
	teams: Player[][]
	onStart: () => void

	constructor(onStart: () => void) {
		this.players = [];
		this.teams = Array(Constants.GAME.NUM_TEAMS).fill([]);

		this.onStart = onStart;
	}

	addPlayer(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, name: string) {
		let teamNum: number = 0;
		for (const team of range(this.teams.length)) {
			if (this.teams[team].length >= Constants.GAME.TEAM_SIZE) {
				continue;
			} else {
				teamNum = team;
				break;
			}
		}
		const player = new Player(socket, name, teamNum);
		this.players.push(player);
		this.teams[teamNum].push(player);

		let teamsFull : boolean = true;
		this.teams.forEach(team => {
			if (team.length < Constants.GAME.TEAM_SIZE) {
				teamsFull = false;
			} else {
			}
		});

		if (teamsFull) {
			console.log('starting game');
			this.start();
		}

		console.log('added player ' + name)

		return player;
	}

	start() {
		this.onStart();
	}

	removePlayer(player: Player) {
		this.players.splice(this.players.indexOf(player), 1);
	}
}

export default Game;