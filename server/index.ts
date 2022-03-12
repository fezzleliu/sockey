import Game from './Game';
import io from './lib/server';

let people = 0;

const games: Game[] = [];

const onStart = () => {
	emptyGame = new Game(onStart);
}

let emptyGame: Game = new Game(onStart);
games.push(emptyGame);

io.on('connection', (socket) => {
	console.log('a user connected');
	const player = emptyGame.addPlayer(socket, 'bob');
	people++;
	io.emit('people', people);
	socket.on('disconnect', () => {
		console.log('a user disconnected');
		emptyGame.removePlayer(player);
		people--;
		io.emit('people', people);
	});
});