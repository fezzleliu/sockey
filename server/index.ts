// @ts-ignore
import express from 'express';
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

io.on('connection', socket => {
	console.log('a user connected');

  socket.on('init', name => {
    console.log(name);
    socket.emit("init", '0');
  })
	socket.on('disconnect', () => {
		console.log('a user disconnected')
	});
});