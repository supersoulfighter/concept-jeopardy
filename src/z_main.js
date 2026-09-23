const config = {
	type: Phaser.AUTO,
	width: 1280,
	height: 720,
	parent: 'game-container',
	backgroundColor: '#000000',
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

// Bind the game to a top-level identifier
const game = new Phaser.Game(config);

// document.addEventListener('DOMContentLoaded', () => {
// 	new Game(config);
// });