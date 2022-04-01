import socket from './lib/socketio';
import { InitData, InitPlayer } from './lib/types';
import Player from './Player';
import Constants from '../../server/lib/Constants';
import { RGB } from './lib/utils';

class Game {
	
	data: InitData
	players: Player[]
	me: Player
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	scale: number;
	mousePos: { x: number; y: number; };
	movement: { key: boolean; mouse: boolean; left: boolean; right: boolean; };
	ball: { x: number; y: number; charge: number, color: RGB; charged: string; };
	points: [number, number];
	startTime: number;


	constructor() {
		console.log('game initalizing');

		this.data = {
			board: {
				width: 1500,
				height: 600,
				goalHeight: 0,
			},
			players: 6,
			id: '',
		}

		this.players = [];

		this.ball = {
			x: 0,
			y: 0,
			charge: 0,
			color: new RGB('#808080'),
			charged: '#FFFF00',
		}

		this.startTime = 0;
		
		socket.on('people', this.onPerson.bind(this));

		socket.on('id', (id: string) => {
			this.data.id = id;
			console.log('id:', this.data.id);
		});

		socket.on('start', this.onStart.bind(this));
	}

	onPerson(people: number) {
		document.getElementById('waiting').innerHTML = `${people}/${this.data.players} joined`;
	}

	onStart(players: InitPlayer[]) {
		console.log('start');

		// create plaeyrs
		players.forEach(playerData => {
			const player = new Player(playerData);
			this.players.push(player);

			// save the you player into the Game.me
			if (playerData.id === this.data.id) {
				console.log('its me!')
				this.me = player;
			}
		});

		// hide waiting for players to join
		//@ts-ignore
		document.getElementsByClassName('waiting')[0].style.display = 'none';

		// run other start stuff
		this.start();
	}

	start() {
		// clear game div
		document.getElementById('game').innerHTML = '';

		const canvas = document.getElementById('game').appendChild(document.createElement('canvas'));

		const ctx = canvas.getContext('2d');

		this.canvas = canvas;
		this.ctx = ctx;

		// resizing
		const resizeCanvas = () => {
			const { width, height } = this.maintainAspectMax(
				this.data.board.width / this.data.board.height,
				{
					width: window.innerWidth,
					height: window.innerHeight
				},
			);
	
			canvas.width = width;
			canvas.height = height;

			this.scale = canvas.width / this.data.board.width;
		};

		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();

		// bring game element to top
		document.getElementById('game').classList.add('active');

		// listen for updates server side
		socket.on('update', this.onServerUpdate.bind(this));

		// start main game loop
		this.startGameLoop();

		setTimeout(this.createEventBindings.bind(this), Constants.GAME.BEGIN_WAIT * 1000);

		this.mousePos = {
			x: 0,
			y: 0,
		};

		this.movement = {
			key: false,
			mouse: false,
			left: false,
			right: false,
		};

		this.points = [0, 0];

		this.startTime = performance ? performance.now() : Date.now();

		document.getElementById('countdown').classList.add('countdown');
	}

	createEventBindings() {
		// mouse movement for angle changes and stuff
		window.addEventListener('mousemove', ({ clientX, clientY }): void => {
			const { x: canvasX, y: canvasY } = this.canvas.getBoundingClientRect();
			const mouseX = clientX - canvasX, mouseY = clientY - canvasY;
			const realX = mouseX / this.scale, realY = mouseY / this.scale;

			const angle = Math.atan2(this.me.y - realY, this.me.x - realX);

			socket.emit('angle', angle);
		});

		window.addEventListener('keydown', ({ key, repeat }): void => {
			if (!repeat && ['w', 'Up', 'ArrowUp'].includes(key)) {
				this.movement.key = true;
				this.updateMovement();
			} else if (!repeat && ['a', 'Left', 'ArrowLeft'].includes(key)) {
				this.movement.left = true;
			} else if (!repeat && ['d', 'Right', 'ArrowRight'].includes(key)) {
				this.movement.right = true;
			} else if (!repeat && [' '].includes(key)) {
				socket.emit('charge');
			}
		});

		window.addEventListener('keyup', ({ key }): void => {
			if (['w', 'Up', 'ArrowUp'].includes(key)) {
				this.movement.key = false;
				this.updateMovement();
			} else if (['a', 'Left', 'ArrowLeft'].includes(key)) {
				this.movement.left = false;
			} else if (['d', 'Right', 'ArrowRight'].includes(key)) {
				this.movement.right = false;
			} else if ([' '].includes(key)) {
				socket.emit('shoot');
			}
		});

		window.addEventListener('mousedown', () => {
			this.movement.mouse = true;
			this.updateMovement();
		});

		window.addEventListener('mouseup', () => {
			this.movement.mouse = false;
			this.updateMovement();
		});
	}

	maintainAspectMax(aspect: number, { width, height }: { width: number; height: number }) {
		const containerAspect = width / height;
		let newWidth: number, newHeight: number;
		if (aspect > containerAspect) {
			// Relativly wider compared to container
			newWidth = width;
			newHeight = width / aspect;
		} else {
			// Relativly taller compared to container
			newWidth / height;
			newWidth = height * aspect;
		}
		return {
			width: newWidth,
			height: newHeight,
		}
	}

	updateMovement() {
		socket.emit('movement', this.movement.key || this.movement.mouse);
	}

	onServerUpdate(players: InitPlayer[], ball: {x: number, y: number, charge: number }, points: [number, number]) {
		players.forEach(playerData => {
			const player = this.players.find(({ id }) => id === playerData.id);
			if (typeof player !== 'undefined') {
				player.update(playerData);
			}
		});

		this.ball.x = ball.x;
		this.ball.y = ball.y;
		this.ball.charge = ball.charge;

		if (this.points[0] !== points[0] || this.points[1] !== points[1]) {
			this.points = points;
			console.log(points)
			document.querySelector('.points .left').innerHTML = points[0].toString();
			document.querySelector('.points .right').innerHTML = points[1].toString();
		}
	}

	startGameLoop() {
		requestAnimationFrame(this.gameLoop.bind(this));
	}

	gameLoop() {
		requestAnimationFrame(this.gameLoop.bind(this));

		// reset for redrawing
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		// draw goals
		const leftGoalColor = this.me.team === 0 ? 'blue' : 'red',
			rightGoalColor = this.me.team === 0 ? 'red' : 'blue',
			goalTop = (1 - Constants.GAME.GOAL.HEIGHT) / 2 * this.canvas.height;

		// left goal
		this.ctx.fillStyle = leftGoalColor;
		this.ctx.fillRect(0, goalTop, Constants.GAME.GOAL.WIDTH * this.scale, Constants.GAME.GOAL.HEIGHT * this.canvas.height);

		// right goal
		this.ctx.fillStyle = rightGoalColor;
		this.ctx.fillRect((Constants.GAME.WIDTH - Constants.GAME.GOAL.WIDTH) * this.scale, goalTop, Constants.GAME.GOAL.WIDTH * this.scale, Constants.GAME.GOAL.HEIGHT * this.canvas.height);

		this.players.forEach(player => {
			if (player === this.me) return;
			player.draw(this.ctx, this.scale, this.me);
		});

		// draw player on top
		this.me.draw(this.ctx, this.scale, this.me);

		// then ball
		this.ctx.fillStyle = this.ball.color.fade(this.ball.charged, this.ball.charge / Constants.BALL.MAX_CHARGE);
		this.ctx.strokeStyle = 'black';
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.translate(this.ball.x * this.scale, this.ball.y * this.scale);
		this.ctx.arc(0, 0, Constants.BALL.RADIUS * this.scale, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.restore();

		// if using arrow keys rotate player
		if ((this.movement.left || this.movement.right) && !(this.movement.left && this.movement.right)) {
			const newAngle = this.me.angle + (this.movement.left ? -1 : 1) * Constants.PLAYER.TURN_SPEED;
			socket.emit('angle', newAngle);
		}

		// update timer on the top
		const currentTime = performance ? performance.now() : Date.now();
		const elapsedTime = Math.min(Math.max((currentTime - this.startTime) / 1000, Constants.GAME.BEGIN_WAIT), Constants.GAME.TIME_LENGTH);

		const minutesElapsed = Math.floor(elapsedTime / 60);
		const minutesLeft = Math.floor(Constants.GAME.TIME_LENGTH / 60) - minutesElapsed - 1;

		const secondsElapsed = elapsedTime - minutesElapsed / 60;
		const secondsLeft = Constants.GAME.TIME_LENGTH - minutesLeft * 60 - secondsElapsed;

		const timeLeft = minutesLeft.toString() + ':' + secondsLeft.toFixed(1).padStart(4, '0')

		document.querySelector('.points .timer').innerHTML = timeLeft;
	}
}

export default Game;