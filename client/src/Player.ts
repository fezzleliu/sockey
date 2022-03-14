import { InitPlayer } from './lib/types';
class Player {
	x: number;
	y: number;
	id: string;
	team: number;
	name: string;

	constructor({ x, y, id, team, name }: InitPlayer) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.team = team;
		this.name = name;
	}

	draw(ctx: CanvasRenderingContext2D, scale: number, team: number) {
		const { width, height } = ctx.canvas;

		ctx.fillStyle = this.team === team ? 'blue' : 'red';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2 * scale;
		ctx.beginPath();
		ctx.arc(this.x * scale, this.y * scale, 15 * scale, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	}

	update({ x, y, id, team, name }: InitPlayer) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.team = team;
		this.name = name;
	}
}

export default Player;