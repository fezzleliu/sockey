import { Socket } from 'socket.io';
import Constants from './lib/Constants';

class Player {

	socket: Socket
	name: string
	team: number
	id: string

	x: number
	y: number

	constructor(socket: Socket, name: string, team: number, playerIndex: number, id: string) {
		this.socket = socket;
		this.name = name;
		this.team = team;
		this.id = id;

		this.x = Constants.GAME.WIDTH / 2 + (Constants.GAME.START_X_SPACE + Constants.PLAYER.RADIUS ) * ( team === 1 ? 1 : -1 );
		this.y = Constants.GAME.HEIGHT / 2 + (Math.ceil(Constants.GAME.TEAM_SIZE / 2) - playerIndex - 1) * (Constants.GAME.START_Y_SPACE + Constants.PLAYER.RADIUS * 2);
	}

	getData() {
		return {
			x: this.x,
			y: this.y,
			id: this.id,
			team: this.team,
			name: this.name,
		}
	}
}

export default Player;