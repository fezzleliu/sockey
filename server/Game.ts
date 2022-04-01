import { range } from 'lodash-es';
import { Socket } from 'socket.io';
import Player from './Player';
import Ball from './Ball';
import Constants from './lib/Constants';
import io from './lib/Server';

const chars: string[] = ('abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '1234567890-').split('');

class Game {
	teams: Player[][]

	onStart: () => void
	id: string
	ball: any;
	started: boolean;
	points: number[];

	constructor(onStart: () => void, id: string) {
		this.teams = Array(Constants.GAME.NUM_TEAMS).fill(null).map(() => []);

		this.onStart = onStart;

		this.id = id;

		this.ball = new Ball(this.onPoint.bind(this));

		this.started = false;

		this.points = [0, 0];
	}
	
	get players() {
		return this.teams.reduce((a, b) => [...a, ...b])
	}

	addPlayer(socket: Socket, name: string) {
		// find which team the are on
		let teamNum: number = 0;
		for (const team of range(this.teams.length)) {
			if (this.teams[team].length >= Constants.GAME.TEAM_SIZE) {
				continue;
			} else {
				teamNum = team;
				break;
			}
		}

		// join socket to room
		socket.join(this.id);

		// add them to the proper team
		const player : Player = new Player(socket, name, teamNum, this.teams[teamNum].length, this.generateId(Constants.PLAYER.ID_LENGTH), this.onReady.bind(this));
		this.teams[teamNum].push(player);
		console.log('added player ' + name);

		io.to(this.id).emit('people', this.players.length);
		console.log('emiting id, ' + player.id);
		io.to(socket.id).emit('id', player.id);

		socket.on('reload', () => {
			io.to(this.id).emit('reload');
		});

		socket.on('charge', () => {
			if (this.ball.grabber == player) {
				this.ball.charging = true;
			}
		});

		socket.on('shoot', () => {
			if (this.ball.grabber == player) {
				this.ball.shoot(player);
			}
		});

		return player;
	}

	onPoint() {
		if (this.ball.x >= Constants.GAME.WIDTH / 2) {
			this.points[0]++;
		} else {
			this.points[1]++;
		}
	}

	generateId(length: number): string {
		const id = new Array(length) // empty array
			.fill(null) // array of nulls
			.map(_ => Math.floor(Math.random() * chars.length)) // array of numbers each number is index of char in chars
			.map(idx => chars[idx]) // array of chars
			.join(''); // string of random chars
		return this.players
			.map(player => player.id)
			.includes(id) ? this.generateId(length) : id;
	}

	loop() {
		this.players.forEach(player => {
			player.update();
		});

		this.ball.update(this.players);

		io.to(this.id).emit('update', this.players.map(player => player.getData()), this.ball.getData(), this.points);
	}

	onReady() {
		// check if ready to start
		let teamsFull : boolean = true;
		this.teams.forEach(team => {
			if (team.length < Constants.GAME.TEAM_SIZE) {
				teamsFull = false;
			} else {
			}
		});

		if (teamsFull) {
			if (this.players.every(player => player.ready)) {
				console.log(this.teams);
				console.log('starting game');
				this.start();
			}
		}
	}

	start() {
		this.started = true;
		
		this.onStart();
		io.to(this.id).emit('start', this.players.map(player => player.getData()));

		setInterval(this.loop.bind(this), 1000 / Constants.GAME.FPS);
	}

	removePlayer(player: Player) {
		for (const team of this.teams) {
			if (team.includes(player)) {
				team.splice(team.indexOf(player), 1);				

				io.to(this.id).emit('people', this.players.length);
				
				break;
			}
		}
	}
}

export default Game;