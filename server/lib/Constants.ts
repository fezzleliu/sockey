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
		GOAL: {
			HEIGHT: 1 / 2,
			WIDTH: 10,
		},
		TIME_LENGTH: 3 * 60 + 3, // in seconds (3 minutes + 3 seconds)
		BEGIN_WAIT: 3, // in seconds (3 seconds)
	},
	PLAYER: {
		RADIUS: 15, // radius of player
		ID_LENGTH: 15,
		HAND: {
			SPACE: 10, // distance between edge of hand and edge of body
			RADIUS: 7,
			ANGLE: Math.PI / 4, // in radians
		},
		SPEED: 7, // pixels per frame
		TURN_SPEED: .1 // radians per frame
	},
	BALL: {
		RADIUS: 17,
		GRAB_DISTANCE: 17, // the distance from the players hands to the center of the ball
		FRICTION: .3,
		MAX_CHARGE: 30,
		CHARGE_RATE: .3,
		DECHARGE_RATE: 5,
	},
}

Object.freeze(Constants);

export default Constants;