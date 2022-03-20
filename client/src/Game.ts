import socket from './socketio';

// define interfaces


class Game {
  
  id: number

  constructor() {
    console.log('game initalizing');

    // send initializing data
    // will be replaced with some sort of form for name and color
    // like https://tase.smart09codes.repl.co
    this.init(window.prompt('enter your name'));
  }

  init(name: string = 'Player') {
    // send init data to server
    socket.emit('init', name);

    const onInit = (data: number) => {
      this.id = data;
      console.log(this.id);
    }

    // wait for data to come back
    socket.on('init', onInit);
  }
}

export default Game;