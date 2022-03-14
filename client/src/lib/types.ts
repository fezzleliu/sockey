// inital data from server
export interface InitData {
	board: {
		width: number,
		height: number,
		goalHeight: number,
	},
	players: number,
	id: string,
}

// player data from server
export interface InitPlayer {
	x: number
	y: number
	id: string
	team: number
	name: string
}