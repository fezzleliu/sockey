import { InitPlayer } from './lib/types';
import Constants from '../../server/lib/Constants';
class Player {
	x: number;
	y: number;
	id: string;
	team: number;
	name: string;
	angle: number;

	constructor({ x, y, id, team, name, angle }: InitPlayer) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.team = team;
		this.name = name;
		this.angle = angle;
	}

	draw(ctx: CanvasRenderingContext2D, scale: number, { team, id }: Player) {
		ctx.fillStyle = this.team !== team ? 'red' : this.id === id ? '#00ff00' : 'blue';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2 * scale;

		// save old pos
		ctx.save();
		// move to player pos
		ctx.translate(this.x * scale, this.y * scale);
		// rotate to player rotation
		ctx.rotate(this.angle + Math.PI / 2);
		
		// draw player
		ctx.beginPath();
		ctx.arc(0, 0, Constants.PLAYER.RADIUS * scale, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		// left hand
		ctx.rotate(-Constants.PLAYER.HAND.ANGLE);
		ctx.beginPath();
		ctx.arc(
			0,
			(Constants.PLAYER.HAND.SPACE + Constants.PLAYER.HAND.RADIUS + Constants.PLAYER.RADIUS) * scale,
			Constants.PLAYER.HAND.RADIUS * scale,
			0,
			Math.PI * 2,
		);
		ctx.fill();
		ctx.stroke();

		// right hand
		ctx.rotate(Constants.PLAYER.HAND.ANGLE * 2);
		ctx.beginPath();
		ctx.arc(
			0,
			(Constants.PLAYER.HAND.SPACE + Constants.PLAYER.HAND.RADIUS + Constants.PLAYER.RADIUS) * scale,
			Constants.PLAYER.HAND.RADIUS * scale,
			0,
			Math.PI * 2,
		);
		ctx.fill();
		ctx.stroke();

		// restore context
		ctx.restore();
	}

	update({ x, y, id, team, name, angle }: InitPlayer) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.team = team;
		this.name = name;
		this.angle = angle;
	}
}

export default Player;