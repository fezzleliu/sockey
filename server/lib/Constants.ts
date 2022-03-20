const Constants = {
	GAME: {
		TEAM_SIZE: 3, // people in a team
		NUM_TEAMS: 2, // number of teams
		WIDTH: 1500, // width of arena
		HEIGHT: 600, // height of arena
		START_X_SPACE: 90, // space between player edge and center of board at start
		START_Y_SPACE: 60, // space between players vertically at start of game
		ID_LENGTH: 15,
		FPS: 60,
	},
	PLAYER: {
		RADIUS: 15, // radius of player
		ID_LENGTH: 15,
		HAND: {
			SPACE: 10, // distance between edge of hand and edge of body
			RADIUS: 7,
			ANGLE: Math.PI / 5 // in radians
		},
		SPEED: 10, // pixels per frame
	},
}

export default Constants;