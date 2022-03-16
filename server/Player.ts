import { Socket } from 'socket.io';
import Constants from './lib/Constants';

class Player {

	socket: Socket
	name: string
	team: number
	id: string

	x: number
	y: number
	angle: number
	isMoving: boolean;

	constructor(socket: Socket, name: string, team: number, playerIndex: number, id: string) {
		this.socket = socket;
		this.name = name;
		this.team = team;
		this.id = id;

		this.x = Constants.GAME.WIDTH / 2 + (Constants.GAME.START_X_SPACE + Constants.PLAYER.RADIUS ) * ( team === 1 ? 1 : -1 );
		this.y = Constants.GAME.HEIGHT / 2 + (Math.ceil(Constants.GAME.TEAM_SIZE / 2) - playerIndex - 1) * (Constants.GAME.START_Y_SPACE + Constants.PLAYER.RADIUS * 2);
		this.angle = team === 0 ? Math.PI : 0;

		this.isMoving = false;

		this.createSocketListeners();
	}

	createSocketListeners() {
		this.socket.on('angle', (angle: number) => this.angle = angle);

		this.socket.on('movement', (isMoving: boolean) => this.isMoving = isMoving);
	}

	update() {
		if (this.isMoving) {
			this.x -= Math.cos(this.angle) * Constants.PLAYER.SPEED;
			this.y -= Math.sin(this.angle) * Constants.PLAYER.SPEED;
		}

		const { RADIUS: radius } = Constants.PLAYER;
		const { WIDTH: width, HEIGHT: height } = Constants.GAME;

		if (this.x - radius < 0) this.x = radius;
		else if (this.x + radius > width) this.x = width - radius;
		if (this.y - radius < 0) this.y = radius;
		else if (this.y + radius > height) this.y = height - radius;
	}

	getData() {
		return {
			x: this.x,
			y: this.y,
			id: this.id,
			team: this.team,
			name: this.name,
			angle: this.angle,
		}
	}
}

export default Player;