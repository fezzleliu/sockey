import socket from './socketio';
import { InitData, InitPlayer } from './lib/types';
import Player from './Player';

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
	players: Player[]
	me: Player
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	scale: number;
	mousePos: { x: number; y: number; };
	movement: { key: boolean; mouse: boolean; };

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

		this.createEventBindings();

		this.mousePos = {
			x: 0,
			y: 0,
		};

		this.movement = {
			key: false,
			mouse: false,
		};
	}

	createEventBindings() {
		// mouse movement for angle changes and stuff
		window.addEventListener('mousemove', ({ clientX, clientY }) => {
			const { x: canvasX, y: canvasY } = this.canvas.getBoundingClientRect();
			const mouseX = clientX - canvasX, mouseY = clientY - canvasY;
			const realX = mouseX / this.scale, realY = mouseY / this.scale;

			const angle = Math.atan2(this.me.y - realY, this.me.x - realX);

			socket.emit('angle', angle);
		});

		window.addEventListener('keydown', ({ key, repeat }) => {
			if (!repeat && key === ' ') {
				this.movement.key = true;
				this.updateMovement();
			}
		});

		window.addEventListener('keyup', ({ key }) => {
			if (key === ' ') {
				this.movement.key = false;
				this.updateMovement();
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

	onServerUpdate(players: InitPlayer[]) {
		players.forEach(playerData => {
			const player = this.players.find(({ id }) => id === playerData.id);
			if (typeof player !== 'undefined') {
				player.update(playerData);
			}
		});
	}

	startGameLoop() {
		requestAnimationFrame(this.gameLoop.bind(this));
	}

	gameLoop() {
		requestAnimationFrame(this.gameLoop.bind(this));

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.players.forEach(player => player.draw(this.ctx, this.scale, this.me));
	}
}

export default Game;