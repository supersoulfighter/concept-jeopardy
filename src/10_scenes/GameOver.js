// The Game Over Scene — shown once every clue has been visited
class GameOver extends Phaser.Scene {

	//#region Constructor //////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	constructor() {
		super({key: CJ.SCENES.GAMEOVER});
	}

	//#endregion



	//#region Events ///////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	create(data) {
		const score = data.score || 0;
		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;

		// Background //
		// Red for a negative score, green otherwise
		this.add.rectangle(
			cx,
			cy,
			this.scale.width,
			this.scale.height,
			hexToInt(score < 0 ? CJ.PALETTE.RED : CJ.PALETTE.GREEN)
		);

		// Win/loss jingle — negative score means the player lost
		this.sound.play(
			score < 0 ? CJ.SFX.LOSE.key : CJ.SFX.WIN.key
		);


		// Text //
		this.add.uiLabel({
			x: cx,
			y: cy - CJ.SPACING.XL,
			text: 'GAME OVER',
			style: {
				...CJ.TYPE_LEVELS.H1,
				textColor: CJ.PALETTE.WHITE
			},
		});

		this.add.uiLabel({
			x: cx,
			y: cy + CJ.SPACING.M,
			text: `FINAL SCORE: $${score}`,
			style: {
				...CJ.TYPE_LEVELS.H2,
				textColor: CJ.PALETTE.WHITE
			},
		});


		// Replay button //
		// A fresh board; resets score and visited clues
		this.add.uiButton({
			x: cx,
			y: cy + CJ.SPACING.XXL,
			width: 220,
			height: 50,
			text: 'Play Again',
			sfx: {
				hover: CJ.SFX.HOVER.key,
				press: CJ.SFX.PRESS.key,
				click: CJ.SFX.SELECT.key,
			},
			style: {
				...CJ.TYPE_LEVELS.P_BIG,
				textColor: CJ.PALETTE.BLACK,
				backgroundColor: CJ.PALETTE.WHITE,
			},
			onClick: () => {
				// Fresh game: reset the score, clear visited tiles, and
				// pass no board so GameBoard builds a new random one.
				this.scene.start(CJ.SCENES.BOARD, {
					score: 0,
					visitedClues: [],
					board: null,
				});
			},
		});
	}

	//#endregion
}
