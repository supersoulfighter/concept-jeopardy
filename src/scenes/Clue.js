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
		},
	};

	// Field where the player types their response
	static INPUT = {
		DY: CJ.SPACING.XS,
		W: 500,
		H: 50,
		COLOR: hexToInt(CJ.PALETTE.WHITE),
		PLACEHOLDER: 'Type your response...',
		PLACEHOLDER_FILL: CJ.PALETTE.GRAY_DARK,
		STYLE: { ...CJ.TYPE_LEVELS.P_BIG, fill: CJ.PALETTE.BLACK },
	};

	// Button immediately right of the input that submits the response
	static SUBMIT_BTN = {
		W: 120,
		H: 50,
		COLOR: hexToInt(CJ.PALETTE.AMBER),
		STYLE: { ...CJ.TYPE_LEVELS.P_BIG, fill: CJ.PALETTE.BLACK },
	};

	// Correct / incorrect verdict shown after submitting
	static RESULT = {
		DY: CJ.SPACING.XS,
		CORRECT_STYLE: { ...CJ.TYPE_LEVELS.H4, fill: CJ.PALETTE.LIME },
		WRONG_STYLE: { ...CJ.TYPE_LEVELS.H4, fill: CJ.PALETTE.RED_BRIGHT },
	};

	// The right "question", revealed after submitting
	static ANSWER = {
		DY: CJ.SPACING.M,
		STYLE: {
			...CJ.TYPE_LEVELS.H4,
			fill: CJ.PALETTE.LIME,
			fontStyle: 'bold',
			align: 'center',
		},
	};

	// Button that returns to the board after the verdict
	static CONTINUE_BTN = {
		DY: CJ.SPACING.XXL,
		W: 200,
		H: 50,
		COLOR: hexToInt(CJ.PALETTE.AMBER),
		STYLE: { ...CJ.TYPE_LEVELS.P_BIG, fill: CJ.PALETTE.BLACK },
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

		// Typed-response state
		this.response = '';
		this.submitted = false;

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

		// Center the input field + submit button as one unit
		const I = Clue.INPUT;
		const S = Clue.SUBMIT_BTN;
		const pairW = I.W + CJ.SPACING.XXS + S.W;
		const inputX = cx - pairW / 2 + I.W / 2;
		const submitX = inputX + I.W / 2 + CJ.SPACING.XXS + S.W / 2;
		const inputY = cy + I.DY;

		// Input field: a white box with the typed text on top
		this.inputBox = this.add.rectangle(inputX, inputY, I.W, I.H, I.COLOR);
		this.inputText = this.add.text(inputX, inputY, '', I.STYLE)
			.setOrigin(0.5);
		this.refreshInputText();

		// Submit button immediately right of the field
		this.submitBtn = this.add.rectangle(
			submitX, inputY, S.W, S.H, S.COLOR
		).setInteractive({useHandCursor: true});
		this.submitText = this.add.text(
			submitX, inputY, 'Submit', { ...S.STYLE }
		).setOrigin(0.5);
		this.submitBtn.on('pointerdown', () => this.submitResponse());

		// Typing: printable keys append, Backspace deletes, Enter submits
		this.input.keyboard.on('keydown', (event) => this.onTypeKey(event));
	}


	// Handle one keypress while the clue is showing.
	onTypeKey(event) {
		// Enter submits — or, once the verdict is showing, continues
		if (event.key === 'Enter') {
			if (this.submitted) {
				this.returnToBoard(this.pointsDelta);
			} else {
				this.submitResponse();
			}
			return;
		}
		if (this.submitted) return; // ignore typing after submit

		if (event.key === 'Backspace') {
			this.response = this.response.slice(0, -1);
		} else if (event.key.length === 1) {
			// length 1 means a printable character (not Shift, Alt, ...)
			this.response += event.key;
		}
		this.refreshInputText();
	}


	// Show the typed text, or the gray placeholder when empty.
	refreshInputText() {
		const I = Clue.INPUT;
		this.inputText.setText(this.response || I.PLACEHOLDER);
		this.inputText.setFill(
			this.response ? I.STYLE.fill : I.PLACEHOLDER_FILL
		);
	}


	// Check the response against the clue's "question" and show the verdict.
	submitResponse() {
		if (this.submitted) return;
		this.submitted = true;

		const isCorrect = normalizeResponse(this.response)
			=== normalizeResponse(this.clue.question);
		this.pointsDelta = isCorrect ? this.clue.value : -this.clue.value;
		this.showResult(isCorrect);
	}


	// Swap the input row for the verdict, the right "question",
	// and a Continue button.
	showResult(isCorrect) {
		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;

		this.inputBox.destroy();
		this.inputText.destroy();
		this.submitBtn.destroy();
		this.submitText.destroy();

		const R = Clue.RESULT;
		this.add.text(
			cx,
			cy + R.DY,
			isCorrect ? 'CORRECT!' : 'INCORRECT',
			isCorrect ? R.CORRECT_STYLE : R.WRONG_STYLE
		).setOrigin(0.5);

		// Reveal the right "question"
		this.add.text(cx, cy + Clue.ANSWER.DY, this.clue.question, {
			...Clue.ANSWER.STYLE,
			wordWrap: {width: Clue.BACKGROUND.TEXT_WRAP}
		}).setOrigin(0.5);

		const B = Clue.CONTINUE_BTN;
		const continueBtn = this.add.rectangle(
			cx, cy + B.DY, B.W, B.H, B.COLOR
		).setInteractive({useHandCursor: true});
		this.add.text(
			cx, cy + B.DY, 'Continue', { ...B.STYLE }
		).setOrigin(0.5);
		continueBtn.on('pointerdown', () => {
			this.returnToBoard(this.pointsDelta);
		});
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