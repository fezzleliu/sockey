
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

class Player {

	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
	name: string
	team: number
	constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, name: string, team: number) {
		this.socket = socket;
		this.name = name;
		this.team = team;
	}
}

export default Player;