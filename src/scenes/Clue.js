// The Active Clue Overlay Scene
class Clue extends Phaser.Scene {

	// Big blue panel behind the clue text
	static BACKGROUND = {
		W: CJ.GAME_WIDTH,
		H: CJ.GAME_HEIGHT,
		COLOR: hexToInt(CJ.PALETTE.BLUE_NAVY),
		TEXT_WRAP: 600, // max line width for prompt and answer
	};

	// Clue prompt (the "answer" in Jeopardy terms)
	static PROMPT = {
		DY: -CJ.SPACING.L,
		STYLE: {
			...CJ.TYPE_LEVELS.H3,
			fill: CJ.PALETTE.WHITE,
			align: 'center',
		},
	};

	// Correct response, shown after Reveal
	static ANSWER = {
		DY: CJ.SPACING.XS,
		STYLE: {
			...CJ.TYPE_LEVELS.H4,
			fill: CJ.PALETTE.LIME,
			fontStyle: 'bold',
			align: 'center',
		},
	};

	// "Reveal Answer" button
	static REVEAL_BTN = {
		DY: CJ.SPACING.L,
		W: 250,
		H: 50,
		COLOR: hexToInt(CJ.PALETTE.AMBER),
		STYLE: { ...CJ.TYPE_LEVELS.P_BIG, fill: CJ.PALETTE.BLACK },
	};

	// Correct / Incorrect buttons on one row
	static SCORE_BTNS = {
		ROW_DY: CJ.SPACING.XXL,
		W: 160,
		H: 50,
		DX: CJ.SPACING.XL, // horizontal offset from center
		CORRECT: hexToInt(CJ.PALETTE.GREEN),
		WRONG: hexToInt(CJ.PALETTE.RED),
		STYLE: { ...CJ.TYPE_LEVELS.P_BIG, fill: CJ.PALETTE.WHITE },
	};


	constructor() {
		super({key: CJ.SCENES.CLUE});
	}


	create(data) {
		this.clue = data.clue;
		this.score = data.score;
		this.visitedClues = data.visitedClues;
		this.board = data.board;
		this.layout = data.layout;

		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;

		// Big blue background for the clue
		this.add.rectangle(cx, cy, Clue.BACKGROUND.W, Clue.BACKGROUND.H, Clue.BACKGROUND.COLOR);

		// Display Clue Prompt
		this.promptText = this.add.text(
			cx,
			cy + Clue.PROMPT.DY,
			this.clue.answer,
			{
				...Clue.PROMPT.STYLE,
				wordWrap: {width: Clue.BACKGROUND.TEXT_WRAP}
			}
		).setOrigin(0.5);

		// Interactive "Reveal Answer" Button
		const R = Clue.REVEAL_BTN;
		const revealBtn = this.add.rectangle(
			cx,
			cy + R.DY,
			R.W,
			R.H,
			R.COLOR
		).setInteractive({useHandCursor: true});

		const revealText = this.add.text(
			cx,
			cy + R.DY,
			'Reveal Answer',
			{ ...R.STYLE }
		).setOrigin(0.5);

		revealBtn.on('pointerdown', () => {
			revealBtn.destroy();
			revealText.destroy();
			this.showAnswerControls();
		});
	}


	showAnswerControls() {
		const B = Clue.SCORE_BTNS;
		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;

		// Show correct answer text
		this.add.text(cx, cy + Clue.ANSWER.DY, this.clue.question, {
			...Clue.ANSWER.STYLE,
			wordWrap: {width: Clue.BACKGROUND.TEXT_WRAP}
		}).setOrigin(0.5);

		// Correct Button (+ Points)
		const correctBtn = this.add.rectangle(
			cx - B.DX,
			cy + B.ROW_DY,
			B.W, B.H,
			B.CORRECT
		).setInteractive({useHandCursor: true});

		this.add.text(
			cx - B.DX,
			cy + B.ROW_DY,
			'Correct',
			{ ...B.STYLE }
		).setOrigin(0.5);
		correctBtn.on('pointerdown', () => this.returnToBoard(this.clue.value));

		// Incorrect Button (- Points)
		const wrongBtn = this.add.rectangle(
			cx + B.DX,
			cy + B.ROW_DY,
			B.W,
			B.H,
			B.WRONG
		).setInteractive({useHandCursor: true});

		this.add.text(
			cx + B.DX,
			cy + B.ROW_DY,
			'Incorrect',
			{ ...B.STYLE }
		).setOrigin(0.5);
		wrongBtn.on('pointerdown', () => this.returnToBoard(-this.clue.value));
	}


	returnToBoard(pointsModifier) {
		this.scene.start(CJ.SCENES.BOARD, {
			score: this.score + pointsModifier,
			visitedClues: this.visitedClues,
			board: this.board,
			layout: this.layout
		});
	}
}