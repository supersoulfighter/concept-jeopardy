// The Game Over Scene — shown once every clue has been visited
class GameOver extends Phaser.Scene {

	// Full-screen background: red for a losing score, green otherwise
	static BACKGROUND = {
		WIN_COLOR: hexToInt(CJ.PALETTE.GREEN),
		LOSE_COLOR: hexToInt(CJ.PALETTE.RED),
	};

	// "GAME OVER" heading
	static HEADING = {
		DY: -CJ.SPACING.XL,
		STYLE: { ...CJ.TYPE_LEVELS.H1, fill: CJ.PALETTE.WHITE },
	};

	// Final score readout under the heading
	static SCORE = {
		DY: CJ.SPACING.M,
		STYLE: { ...CJ.TYPE_LEVELS.H2, fill: CJ.PALETTE.WHITE },
	};

	// Button that starts a fresh game
	static REPLAY_BTN = {
		DY: CJ.SPACING.XXL,
		W: 220,
		H: 50,
		COLOR: hexToInt(CJ.PALETTE.WHITE),
		STYLE: { ...CJ.TYPE_LEVELS.P_BIG, fill: CJ.PALETTE.BLACK },
	};


	constructor() {
		super({key: CJ.SCENES.GAMEOVER});
	}


	create(data) {
		const score = data.score || 0;
		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;

		// Red background for a negative score, green otherwise
		const B = GameOver.BACKGROUND;
		this.add.rectangle(
			cx, cy, this.scale.width, this.scale.height,
			score < 0 ? B.LOSE_COLOR : B.WIN_COLOR
		);

		this.add.text(
			cx, cy + GameOver.HEADING.DY, 'GAME OVER',
			{ ...GameOver.HEADING.STYLE }
		).setOrigin(0.5);

		this.add.text(
			cx, cy + GameOver.SCORE.DY, `FINAL SCORE: $${score}`,
			{ ...GameOver.SCORE.STYLE }
		).setOrigin(0.5);

		// Replay button — a fresh board resets score and visited clues
		const R = GameOver.REPLAY_BTN;
		const replayBtn = this.add.rectangle(
			cx, cy + R.DY, R.W, R.H, R.COLOR
		).setInteractive({useHandCursor: true});
		this.add.text(
			cx, cy + R.DY, 'Play Again', { ...R.STYLE }
		).setOrigin(0.5);
		replayBtn.on('pointerdown', () => {
			// Fresh game: reset the score, clear visited tiles, and pass
			// no board so GameBoard builds a new random one.
			this.scene.start(CJ.SCENES.BOARD, {
				score: 0,
				visitedClues: [],
				board: null,
			});
		});
	}
}
