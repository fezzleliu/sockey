import { socket } from "./lib/socketio";
import { BallData, InitData, InitPlayer, MouseData, PointsData } from "./lib/types";
import Player from "./Player";
import Constants from "../../server/lib/Constants";
import { RGB } from "./lib/utils";
import { Joystick } from "@fezzle/joystick";

class Game {
  data: InitData;

  players: Player[];
  me: Player;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scale: number;

  mousePos: { x: number; y: number };
  movement: MouseData;

  ball: BallData;

  points: PointsData;

  startTime: number;

  joystick: Joystick;
  useMobile: boolean;
  charging: boolean;
  charger: SVGAElement;
  chargeStart: number;
	id: string;

  constructor(images: { [key: string]: HTMLImageElement }) {
    console.log("game initalizing");

    // check for mobile
    this.useMobile = (a => {
      return (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      );
      //@ts-ignore
    })(navigator.userAgent || navigator.vendor || window.opera);

    // initiallize data
    this.id = "";

		// initiallize variables
    this.players = [];

    this.ball = {
      x: 0,
      y: 0,
      charge: 0,
      color: new RGB("#808080"),
      charged: "#FFFF00",
    };

    this.startTime = 0;
		
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

		// set up socket starting stuff
    socket.on("people", this.onPerson.bind(this));

    socket.on("id", (id: string) => {
      this.id = id;
      console.log("id:", this.id);

      socket.emit("ready");
    });

    socket.on("start", this.onStart.bind(this));

		// add images to smash thingy
    this.addImages(images);

    // set up start screen
    const form: HTMLFormElement = document.querySelector(".start-outer .outer .form");

    form.addEventListener("submit", e => {
      e.preventDefault();
      const data = new FormData(form);

      const name = data.get("name") as string;

      socket.emit("init", name);

      // hide start screen
      // @ts-ignore
      document.querySelector(".start-outer").style.display = "none";
    });

    if (
      localStorage.getItem("autostart") &&
      localStorage.getItem("autostart") !== "" &&
      // @ts-ignore
      import.meta.env.DEV
    ) {
      console.log("autostart");
      (document.querySelector(".start-outer .outer .form .name") as HTMLInputElement).value =
        localStorage.getItem("autostart");
      setTimeout(
        () => (document.querySelector(".start-outer .outer .form .start") as HTMLInputElement).click(),
        1000
      );
    }
  }

  addImages(images: { [key: string]: HTMLImageElement }) {
		// find containers for smash
    const leftContainers = document.querySelectorAll("#smash .left .rect .player .img");
    const rightContainers = document.querySelectorAll("#smash .right .rect .player .img");

		// add images
    leftContainers.forEach(container => {
      container.appendChild(images.bluePlayer.cloneNode(true));
    });

    rightContainers.forEach(container => {
      container.appendChild(images.redPlayer.cloneNode(true));
    });

		// loading images in bounce
    document
      .querySelectorAll(".waiting .outer .inner .loading")[0]
      .appendChild(images.bluePlayer.cloneNode(true));
    document
      .querySelectorAll(".waiting .outer .inner .loading")[1]
      .appendChild(images.redPlayer.cloneNode(true));
  }

  onPerson(people: number) {
		// change the number of people in the loader
    document.getElementById("waiting").innerHTML = `${people}/${Constants.GAME.NUM_TEAMS * Constants.GAME.TEAM_SIZE} joined`;
  }

  onStart(players: InitPlayer[]) {
    // create plaeyrs
    players.forEach(playerData => {
      const player = new Player(playerData);
      this.players.push(player);

      // save the you player into the Game.me
      if (playerData.id === this.id) {
        this.me = player;
      }
    });

    // hide waiting for players to join
    //@ts-ignore
    document.getElementsByClassName("waiting")[0].style.display = "none";

    // clear game div
    document.getElementById("game").innerHTML = "";

		// create canvas and add to dom, get context
    const canvas = document.getElementById("game").appendChild(document.createElement("canvas"));
    const ctx = canvas.getContext("2d");

    this.canvas = canvas;
    this.ctx = ctx;

    // resizing
    const resizeCanvas = () => {
			// calculate new size
      const { width, height } = this.maintainAspectMax(Constants.GAME.WIDTH / Constants.GAME.HEIGHT, {
        width: window.innerWidth,
        height: window.innerHeight,
      });

      canvas.width = width;
      canvas.height = height;

			// save scale
      this.scale = canvas.width / Constants.GAME.WIDTH;
    };

    window.addEventListener("resize", resizeCanvas);
		// resize on start to fit to window
    resizeCanvas();

    // bring game element to top
    document.getElementById("game").classList.add("active");

    // listen for updates server side
    socket.on("update", this.onServerUpdate.bind(this));

    // start main game loop
    this.startGameLoop();

		// don't send data to server until game started. Also back up on server
    setTimeout(this.createEventBindings.bind(this), Constants.GAME.BEGIN_WAIT * 1000);


    this.startTime = performance ? performance.now() : Date.now();

    // starting animationa
    document.querySelector("#smash").classList.remove("hidden");
    document.querySelector("#smash").classList.add("show");
    setTimeout(() => {
      document.querySelector("#smash").classList.add("smash");
    }, 50);
    setTimeout(() => {
      document.querySelector("#smash").classList.remove("show");
      document.querySelector("#smash").classList.remove("smash");
      document.querySelector("#smash").classList.add("hide");
      setTimeout(() => {
        document.querySelector("#smash").classList.add("none");
      });

      document.querySelector("#countdown").classList.add("countdown");
    }, 2000);

		if (this.me.team === 1) {
			document.querySelector('.points-outer .points').classList.add('swap');
		}

		// setup mobile
    if (this.useMobile) this.mobileMode();
  }

  mobileMode() {
		// create joystick 
    this.joystick = new Joystick({ innerRadius: 25, outerRadius: 60 });

    document.body.appendChild(this.joystick.dom);

    this.joystick.dom.classList.add("joy");

    this.joystick.dom.style.cssText =
      "position: fixed; bottom: 10px; left:10px; /* backdrop-filter: blur(2px); */";

    this.charging = false;
    this.chargeStart = performance.now();

    this.charger = document.querySelector(".shoot");
    this.charger.style.display = "block";
  }

  createEventBindings() {
    if (!this.useMobile) {
      // mouse movement for angle changes and stuff
      window.addEventListener("mousemove", ({ clientX, clientY }): void => {
        const { x: canvasX, y: canvasY } = this.canvas.getBoundingClientRect();
        const mouseX = clientX - canvasX,
          mouseY = clientY - canvasY;
        const realX = mouseX / this.scale,
          realY = mouseY / this.scale;

        const angle = Math.atan2(this.me.y - realY, this.me.x - realX);

        socket.emit("angle", angle);
      });

      window.addEventListener("keydown", ({ key, repeat }): void => {
        if (!repeat && ["w", "Up", "ArrowUp"].includes(key)) {
          this.movement.key = true;
          this.updateMovement();
        } else if (!repeat && ["a", "Left", "ArrowLeft"].includes(key)) {
          this.movement.left = true;
        } else if (!repeat && ["d", "Right", "ArrowRight"].includes(key)) {
          this.movement.right = true;
        } else if (!repeat && [" "].includes(key)) {
          socket.emit("charge");
        }
      });

      window.addEventListener("keyup", ({ key }): void => {
        if (["w", "Up", "ArrowUp"].includes(key)) {
          this.movement.key = false;
          this.updateMovement();
        } else if (["a", "Left", "ArrowLeft"].includes(key)) {
          this.movement.left = false;
        } else if (["d", "Right", "ArrowRight"].includes(key)) {
          this.movement.right = false;
        } else if ([" "].includes(key)) {
          socket.emit("shoot");
        }
      });

      window.addEventListener("mousedown", () => {
        this.movement.mouse = true;
        this.updateMovement();
      });

      window.addEventListener("mouseup", () => {
        this.movement.mouse = false;
        this.updateMovement();
      });
    } else {
      this.joystick.on("start", () => {
        this.movement.mouse = true;
        this.updateMovement();
      });

      this.joystick.on("end", () => {
        this.movement.mouse = false;
        this.updateMovement();
      });

      this.joystick.on("move", angle => {
        socket.emit("angle", angle + Math.PI / 2);
      });

      this.charger.addEventListener("touchstart", () => {
        this.charging = true;
        socket.emit("charge");
      });

      this.charger.addEventListener("touchend", () => {
        this.charging = false;
        socket.emit("shoot");
      });

      this.charger.addEventListener("touchcancel", () => {
        this.charging = false;
        socket.emit("shoot");
      });
    }
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
    };
  }

  updateMovement() {
    socket.emit("movement", this.movement.key || this.movement.mouse);
  }

  onServerUpdate(
    players: InitPlayer[],
    ball: { x: number; y: number; charge: number },
    points: [number, number]
  ) {
    players.forEach(playerData => {
      const player = this.players.find(({ id }) => id === playerData.id);
      if (typeof player !== "undefined") {
        player.update(playerData);
      }
    });

    this.ball.x = ball.x;
    this.ball.y = ball.y;
    this.ball.charge = ball.charge;

    if (this.points[0] !== points[0] || this.points[1] !== points[1]) {
      this.points = points;
      document.querySelector(".points-outer .points .left").innerHTML = points[0].toString();
      document.querySelector(".points-outer .points .right").innerHTML = points[1].toString();
    }
  }

  startGameLoop() {
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop() {
    let continueLoop = true;

    // reset for redrawing
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw goals
    const leftGoalColor = this.me.team === 0 ? "blue" : "red",
      rightGoalColor = this.me.team === 0 ? "red" : "blue",
      goalTop = ((1 - Constants.GAME.GOAL.HEIGHT) / 2) * this.canvas.height;

    // left goal
    this.ctx.fillStyle = leftGoalColor;
    this.ctx.fillRect(
      0,
      goalTop,
      Constants.GAME.GOAL.WIDTH * this.scale,
      Constants.GAME.GOAL.HEIGHT * this.canvas.height
    );

    // right goal
    this.ctx.fillStyle = rightGoalColor;
    this.ctx.fillRect(
      (Constants.GAME.WIDTH - Constants.GAME.GOAL.WIDTH) * this.scale,
      goalTop,
      Constants.GAME.GOAL.WIDTH * this.scale,
      Constants.GAME.GOAL.HEIGHT * this.canvas.height
    );

    // draw boundaries
    this.ctx.lineWidth = 4 * this.scale;
    // right boundary
    this.ctx.strokeStyle = this.me.team === 1 ? "blue" : "red";
    this.ctx.beginPath();
    this.ctx.arc(
      Constants.GAME.WIDTH * this.scale,
      (Constants.GAME.HEIGHT / 2) * this.scale,
      Constants.GAME.BOUNDARY_RADIUS * this.scale,
      0,
      2 * Math.PI
    );
    this.ctx.stroke();

    // draw left boundary
    this.ctx.strokeStyle = this.me.team === 1 ? "red" : "blue";
    this.ctx.beginPath();
    this.ctx.arc(
      0,
      (Constants.GAME.HEIGHT / 2) * this.scale,
      Constants.GAME.BOUNDARY_RADIUS * this.scale,
      0,
      2 * Math.PI
    );
    this.ctx.stroke();

    // draw players
    this.players.forEach(player => {
      if (player === this.me) return;
      player.draw(this.ctx, this.scale, this.me);
    });

    // draw player on top
    this.me.draw(this.ctx, this.scale, this.me);

    // then ball
    this.ctx.fillStyle = this.ball.color.fade(
      this.ball.charged,
      this.ball.charge / Constants.BALL.MAX_CHARGE
    );
    this.ctx.strokeStyle = "black";
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
      socket.emit("angle", newAngle);
    }

    // update timer on the top
    const currentTime = performance ? performance.now() : Date.now();
    const elapsedTime = Math.min(
      Math.max((currentTime - this.startTime) / 1000 - Constants.GAME.BEGIN_WAIT, 0),
      Constants.GAME.TIME_LENGTH
    );

    const left = Constants.GAME.TIME_LENGTH - elapsedTime;

    if (left <= 0) {
      continueLoop = false;
      alert("game over");
    }

    const minutesLeft = Math.floor(left / 60);

    const secondsLeft = left % 60;

    const timeLeft = minutesLeft.toString() + ":" + secondsLeft.toFixed(1).padStart(4, "0");

    document.querySelector(".points-outer .points .timer").innerHTML = timeLeft.toString();

    // update the mobile charger thingy
    if (this.charger && this.charging) {
      const charge = (this.ball.charge / Constants.BALL.MAX_CHARGE) * 100;

      document.getElementById("charge-stop-first").setAttribute("offset", `${charge}%`);
      document
        .getElementById("charge-stop-second")
        .setAttribute("offset", `${Math.min(charge + 0.01, 100)}%`);
    } else {
      const charge = 0;

      document.getElementById("charge-stop-first").setAttribute("offset", `${charge}%`);
      document
        .getElementById("charge-stop-second")
        .setAttribute("offset", `${Math.min(charge + 0.01, 100)}%`);
    }

    if (continueLoop) requestAnimationFrame(this.gameLoop.bind(this));
  }
}

export default Game;
