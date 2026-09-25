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
		Clue,
		GameOver,
		UITest
	],
};

// Create the game
const game = new Phaser.Game(config);

// F2 toggles the UI test overlay from anywhere in the game.
// Listening on window (not a scene) means it works no matter
// which scene is running. game.scene is the global SceneManager:
// run() overlays the scene without stopping the current one
// (like this.scene.launch() does from inside a scene), and
// stop() removes it.
window.addEventListener('keydown', (event) => {
	if (event.key !== 'F2') return;
	event.preventDefault(); // keep the browser's own F2 action off
	if (game.scene.isActive(CJ.SCENES.UI_TEST)) {
		game.scene.stop(CJ.SCENES.UI_TEST);
	} else {
		game.scene.run(CJ.SCENES.UI_TEST);
	}
});
