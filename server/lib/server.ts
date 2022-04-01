import { exec } from 'child_process';
import express from 'express';
import path from 'path';
import { Server } from 'socket.io';

const app = express();
const port = process.env.PORT || 8081; // vite runs on 3000
const server = app.listen(port, () => console.log('running on ' + port.toString()));


const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  }
});

if (process.argv.includes('-host')) {
	exec('npm run build', (_, stdout, __) => {
		console.log(stdout);
		console.log(path.join(__dirname, '../client/dist/index.html'));
		app.use(express.static(path.join(__dirname, '../client/dist')));
		console.log('hosting');
	});
}

export default io;
export { app };