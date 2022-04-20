import Constants from './lib/Constants';
import Game from './Game';
import io from './lib/Server';

const games: Game[] = [];

const chars: string[] = ('abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '1234567890-').split('');

const generateId = (length: number): string => {
	const id = new Array(length) // empty array
		.fill(null) // array of nulls
		.map(_ => Math.floor(Math.random() * chars.length)) // array of numbers each number is index of char in chars
		.map(idx => chars[idx]) // array of chars
		.join(''); // string of random chars
	return games
		.map(game => game.id)
		.includes(id) ? generateId(length) : id;

}

const onStart = () => {
	emptyGame = new Game(onStart, generateId(Constants.GAME.ID_LENGTH));
}


let emptyGame: Game = new Game(onStart, generateId(Constants.GAME.ID_LENGTH));
games.push(emptyGame);

io.on('connection', (socket) => {
	// const player = emptyGame.addPlayer(socket, 'bob');

	socket.on('init', (name: string) => {
		emptyGame.addPlayer(socket, name);
	});
});