import { exec } from "child_process";
import express from "express";
import path from "path";
import fs from "fs";
import https from "https";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

if (process.argv.includes("-host")) {
  exec("npm run build", (_, stdout, __) => {
    console.log(stdout);
    console.log(path.join(__dirname, "../../client/dist/"));
		console.log(fs.readdirSync(path.join(__dirname, "../../client/dist/")));
    app.use(express.static(path.join(__dirname, "../../client/dist")));
    console.log("hosting");
  });
}

const port = process.env.PORT || 8081; // vite runs on 8080
const credentials: https.ServerOptions = {
	// key: fs.readFileSync(path.join(__dirname, "../ssl/private.pem"), 'utf8'),
	cert: fs.readFileSync(path.join(__dirname, "../ssl/server.crt"), 'utf8'),
};
const server = https.createServer(credentials, app);

server.listen(port, () => {
	console.log('listening on port ' + port);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

export default io;
export { app };