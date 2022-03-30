import Constants from "./lib/Constants";
import { Point } from "./lib/utils";
import Player from "./Player";

class Ball extends Point{
	radius: number;
	grabber: Player | null;
	v: { x: number; y: number; };
	charge: number;
	charging: boolean;
	lastGrabber: Player | null;
	onScore: () => void;
	angle: number;

	constructor(onScore = () => {}) {
		super(Constants.GAME.WIDTH / 2, Constants.GAME.HEIGHT / 2);
		this.radius = Constants.BALL.RADIUS;

		this.v = {
			x: 0,
			y: 0,
		}

		this.charge = 0;

		this.charging = false;

		this.grabber = null;

		this.lastGrabber = null;

		this.angle = 0;

		this.onScore = onScore;
	}

	update(players: Player[]) {
		// check if anyone grabs ball
		if (this.grabber) {
			// move ball to grabber's location and angle
			const newLocation = this.grabber
				.addY(Constants.PLAYER.RADIUS + Constants.PLAYER.HAND.SPACE + Constants.PLAYER.HAND.RADIUS)
				.rotateAroundPoint(this.grabber, -this.grabber.angle - Math.PI / 2);
			
			this.x = newLocation.x;
			this.y = newLocation.y;
		} else {
			// see if anyone can grab the ball
			let grabbed: boolean = false;
			for (const player of players) {
				if (
					player
						.addY(Constants.PLAYER.RADIUS + Constants.PLAYER.HAND.SPACE + Constants.PLAYER.HAND.RADIUS)
						.rotateAroundPoint(player, -player.angle - Math.PI / 2)
						.distanceTo(this) < Constants.BALL.GRAB_DISTANCE
					&& this.lastGrabber !== player
				) {
					this.grabber = player;

					const newLocation = this.grabber
						.addY(Constants.PLAYER.RADIUS + Constants.PLAYER.HAND.SPACE + Constants.PLAYER.HAND.RADIUS)
						.rotateAroundPoint(this.grabber, -this.grabber.angle - Math.PI / 2);
					
					this.x = newLocation.x;
					this.y = newLocation.y;

					grabbed = true;
					break;
				}
			}

			if (!grabbed) {
				// ball is rolling
				// apply phisics

				// apply x friction
				if (Math.abs(this.v.x) <= Constants.BALL.FRICTION) this.v.x = 0;
				else this.v.x -= (this.v.x >= 0 ? 1 : -1) * Constants.BALL.FRICTION * Math.abs(Math.cos(this.angle));

				// apply y friction
				if (Math.abs(this.v.y) <= Constants.BALL.FRICTION) this.v.y = 0;
				else this.v.y -= (this.v.y >= 0 ? 1 : -1) * Constants.BALL.FRICTION * Math.abs(Math.sin(this.angle));

				// move ball
				this.x += this.v.x;
				this.y += this.v.y;

				// check if it could be in the x
				if (
					this.y - this.radius >= (Constants.GAME.HEIGHT - Constants.GAME.HEIGHT * Constants.GAME.GOAL.HEIGHT) / 2
					&& this.y + this.radius <= (Constants.GAME.HEIGHT - Constants.GAME.HEIGHT * Constants.GAME.GOAL.HEIGHT) / 2 + Constants.GAME.HEIGHT * Constants.GAME.GOAL.HEIGHT
				) {
					// if it is in the goal
					if (this.x + this.radius < 0 || this.x - this.radius >= Constants.GAME.WIDTH) {
						// tell everyone there was a score
						this.onScore();

						// reset the ball
						console.log('goal');

						this.lastGrabber = null;
						this.x = Constants.GAME.WIDTH / 2;
						this.y = Constants.GAME.HEIGHT / 2;

						this.v.x = 0;
						this.v.y = 0;
					}
				} else {
					// otherwise apply bouncing
					if (this.x - this.radius <= 0) {
						this.x = this.radius;
						this.v.x *= -1;
					} else if (this.x + this.radius >= Constants.GAME.WIDTH) {
						this.x = Constants.GAME.WIDTH - this.radius;
						this.v.x *= -1;
					}
					if (this.y - this.radius <= 0) {
						this.y = this.radius;
						this.v.y *= -1;
					} else if (this.y + this.radius >= Constants.GAME.HEIGHT) {
						this.y = Constants.GAME.HEIGHT - this.radius;
						this.v.y *= -1;
					}
				}
			} 
		}

		// apply charge effects
		if (!this.charging) this.charge = Math.max(this.charge - Constants.BALL.DECHARGE_RATE, 0);
		else {
			// charging
			this.charge = Math.min(this.charge + Constants.BALL.CHARGE_RATE, Constants.BALL.MAX_CHARGE);
		}
	}

	shoot(player: Player) {
		this.charging = false;
		this.grabber = null;

		this.lastGrabber = player;
		setTimeout(() => {
			this.lastGrabber = null;
		}, 1000);

		this.v.x = Math.cos(player.angle - Math.PI) * this.charge;
		this.v.y = Math.sin(player.angle - Math.PI) * this.charge;

		this.angle = player.angle - Math.PI;
	}

	getData() {
		return {
			x: this.x,
			y: this.y,
			angle: this.angle,

			charge: this.charge,
		}
	}
}

export default Ball;