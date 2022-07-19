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
			HEIGHT: 1 / 2.5,
			WIDTH: 10,
		},
		TIME_LENGTH: 3 * 3, // in seconds (3 minutes)
		BEGIN_WAIT: 5, // in seconds (5 seconds)
		BOUNDARY_RADIUS: 350, // radius of the boundary that players cannot enter
	},
	PLAYER: {
		RADIUS: 15, // radius of player
		ID_LENGTH: 15,
		HAND: {
			SPACE: 10, // distance between edge of hand and edge of body
			RADIUS: 7,
			ANGLE: Math.PI / 4, // in radians
		},
		SPEED: 4.5, // pixels per frame
		TURN_SPEED: .2 // radians per frame
	},
	BALL: {
		RADIUS: 17,
		GRAB_DISTANCE: 17, // the distance from the players hands to the center of the ball
		FRICTION: .45,
		MAX_CHARGE: 30,
		CHARGE_RATE: .3,
		DECHARGE_RATE: 5,
	},
}

Object.freeze(Constants);

export default Constants;