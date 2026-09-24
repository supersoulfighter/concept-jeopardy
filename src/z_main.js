// Initial game configuration
const config = {
	type: Phaser.AUTO,
	width: CJ.GAME_WIDTH,
	height: CJ.GAME_HEIGHT,
	parent: CJ.GAME_HTML_ELEMENT,
	backgroundColor: CJ.COLORS.BG,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [
		Boot,
		Preloader,
		MainMenu,
		GameBoard,
		Clue
	],
};

// Create the game
const game = new Phaser.Game(config);
