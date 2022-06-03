import { Socket } from 'socket.io';
import Constants from './lib/Constants';
import { Point } from './lib/utils';

class Player extends Point {

	socket: Socket
	name: string
	team: number
	id: string

	angle: number
	isMoving: boolean;
	onReady: () => void;
	ready: boolean;

	constructor(socket: Socket, name: string, team: number, playerIndex: number, id: string, onReady: () => void) {
		const x = Constants.GAME.WIDTH / 2 + (Constants.GAME.START_X_SPACE + Constants.PLAYER.RADIUS ) * ( team === 1 ? 1 : -1 ),
			y = Constants.GAME.HEIGHT / 2 + (Math.ceil(Constants.GAME.TEAM_SIZE / 2) - playerIndex - 1) * (Constants.GAME.START_Y_SPACE + Constants.PLAYER.RADIUS * 2);
		
		super(x, y);
		this.socket = socket;
		this.name = name;
		this.team = team;
		this.id = id;

		this.angle = team === 0 ? Math.PI : 0;

		this.isMoving = false;

		this.createSocketListeners();

		this.onReady = onReady;

		this.ready = false;
	}

	createSocketListeners() {
		this.socket.on('angle', (angle: number) => this.angle = angle);

		this.socket.on('movement', (isMoving: boolean) => this.isMoving = isMoving);

		this.socket.on('ready', () => {
			this.ready = true;
			this.onReady();
		})
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

		// right boundary
		if (this.team === 0 && this.distanceTo(new Point(Constants.GAME.WIDTH, Constants.GAME.HEIGHT / 2)) < Constants.GAME.BOUNDARY_RADIUS) {
			// keep player out of circle
			const angle = Math.atan2(this.y - Constants.GAME.HEIGHT / 2, this.x - Constants.GAME.WIDTH);
			this.x = Constants.GAME.WIDTH + Constants.GAME.BOUNDARY_RADIUS * Math.cos(angle);
			this.y = Constants.GAME.HEIGHT / 2 + Constants.GAME.BOUNDARY_RADIUS * Math.sin(angle);
		}

		// left boundary
		if (this.team === 1 && this.distanceTo(new Point(0, Constants.GAME.HEIGHT / 2)) < Constants.GAME.BOUNDARY_RADIUS) {
			// keep player out of circle
			const angle = Math.atan2(this.y - Constants.GAME.HEIGHT / 2, this.x - 0);
			this.x = Constants.GAME.BOUNDARY_RADIUS * Math.cos(angle);
			this.y = Constants.GAME.HEIGHT / 2 + Constants.GAME.BOUNDARY_RADIUS * Math.sin(angle);
		}
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