import { exec } from "child_process";
// @ts-ignore
import express from "express";
import path from "path";
import fs from "fs";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8081; // vite runs on 8080
const server = app.listen(port, () => {
  console.log("listening on port", port);
});

if (process.argv.includes("-host")) {
  exec("npm run build", (_, stdout, __) => {
    console.log(stdout);
    console.log(path.join(__dirname, "../../client/dist/"));
    console.log(fs.readdirSync(path.join(__dirname, "../../client/dist/")));
    app.use(express.static(path.join(__dirname, "../../client/dist")));
    console.log("hosting");
  });
}

const io = new Server(server, {
  cors: {
    origin: process.argv.includes("-host")
      ? [
          "https://sockey-game.herokuapp.com",
          "https://www.lexma.cf",
          "https://sockey.fezzle.dev",
        ]
      : "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

export default io;
export { app };
