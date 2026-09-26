// The Active Clue Overlay Scene
class Clue extends Phaser.Scene {

	//#region Constructor //////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	constructor() {
		super({key: CJ.SCENES.CLUE});
	}

	//#endregion



	//#region Events ///////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	create(data) {
		this.clue = data.clue;
		this.score = data.score;
		this.visitedClues = data.visitedClues;
		this.board = data.board;
		this.layout = data.layout;
		this.submitted = false;
		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;


		// Background //
		this.add.rectangle(
			cx,
			cy,
			this.scale.width,
			this.scale.height,
			hexToInt(CJ.PALETTE.BLUE_NAVY)
		);


		// Clue Prompt //
		// the "answer" in Jeopardy terms
		this.add.uiLabel({
			x: cx,
			y: cy - CJ.SPACING.L,
			text: this.clue.answer,
			style: {
				...CJ.TYPE_LEVELS.H3,
				textColor: CJ.PALETTE.WHITE,
				wordWrap: { width: 600 }, // max line width
			},
		});


		const inputW = 500;
		const inputH = 50;
		const submitW = 120;
		const pairW = inputW + CJ.SPACING.XXS + submitW;
		const inputX = cx - pairW / 2 + inputW / 2;
		const submitX = inputX + inputW / 2 + CJ.SPACING.XXS + submitW / 2;
		const inputY = cy + CJ.SPACING.XS;


		// Input field //
		this.inputField = this.add.uiInput({
			x: inputX,
			y: inputY,
			width: inputW,
			height: inputH,
			placeholder: 'Type your response...',
			sfx: {
				focus: CJ.SFX.FOCUS.key,
				type: CJ.SFX.TYPE.key,
				submit: CJ.SFX.SUBMIT.key,
			},
			style: {
				...CJ.TYPE_LEVELS.P_BIG,
				textColor: CJ.PALETTE.BLACK,
				backgroundColor: CJ.PALETTE.WHITE,
				placeholderColor: CJ.PALETTE.GRAY_DARK,
				cursorColor: CJ.PALETTE.BLACK
			},
			onSubmit: () => this.submitResponse(),
		});
		this.inputField.focus(); // start typing right away


		// Clue sting //
		// Little jingle each time a clue opens
		this.sound.play(CJ.SFX.CLUE.key);


		// Submit button //
		this.submitBtn = this.add.uiButton({
			x: submitX,
			y: inputY,
			width: submitW,
			height: inputH,
			text: 'Submit',
			sfx: {
				hover: CJ.SFX.HOVER.key,
				press: CJ.SFX.PRESS.key,
				click: CJ.SFX.SELECT.key,
			},
			style: {
				...CJ.TYPE_LEVELS.P_BIG,
				textColor: CJ.PALETTE.BLACK,
				backgroundColor: CJ.PALETTE.AMBER,
			},
			onClick: () => this.submitResponse(),
		});


		// Countdown //
		// a bar along the bottom edge that shrinks to zero
		// over 6 seconds. delayedCall fires onTimeUp once; update()
		// animates the bar each frame.
		const barH = 12;
		this.timerBar = this.add.rectangle(
			0,
			this.scale.height - barH,
			this.scale.width,
			barH,
			hexToInt(CJ.PALETTE.AMBER)
		).setOrigin(0, 0);
		this.timer = this.time.delayedCall(
			15000, // ms the player gets to respond
			() => this.onTimeUp()
		);


		// Scene-level keys: Enter skips ahead once the verdict shows
		this.input.keyboard.on(
			'keydown',
			(event) => this.onTypeKey(event)
		);
	}


	// Shrink the timer bar to match the countdown's remaining time.
	update() {
		if (this.submitted) return;
		this.timerBar.scaleX = 1 - this.timer.getProgress();
	}


	// The uiInput owns typing; this only catches Enter after the
	// verdict shows, so keyboard players can continue without
	// reaching for the mouse. usedByInput means this same keypress
	// already submitted the response — leave the verdict on screen.
	onTypeKey(event) {
		if (event.key === 'Enter' && this.submitted && !event.usedByInput) {
			// Same cue as the Continue button it stands in for
			this.sound.play(CJ.SFX.SELECT.key);
			this.returnToBoard();
		}
	}


	// The countdown hit zero — same penalty as a wrong response.
	onTimeUp() {
		this.sound.play(CJ.SFX.EXPIRED.key);
		this.finishRound(
			'TIMES UP',
			CJ.PALETTE.RED_BRIGHT,
			-this.clue.value
		);
	}


	//#endregion



	//#region Internals ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// Check the response against the clue's "question" and show the verdict.
	submitResponse() {
		if (this.submitted) return;

		const isCorrect = Clue.normalizeResponse(this.inputField.getValue())
			=== Clue.normalizeResponse(this.clue.question);
		this.sound.play(
			isCorrect ? CJ.SFX.CORRECT.key : CJ.SFX.INCORRECT.key
		);
		this.finishRound(
			isCorrect ? 'CORRECT!' : 'INCORRECT',
			isCorrect ? CJ.PALETTE.LIME : CJ.PALETTE.RED_BRIGHT,
			isCorrect ? this.clue.value : -this.clue.value
		);
	}


	// Lock in the outcome, stop the timer, and swap the input row for
	// the verdict, the right "question", and a Continue button.
	finishRound(verdict, verdictColor, pointsDelta) {
		if (this.submitted) return;
		this.submitted = true;
		this.pointsDelta = pointsDelta;

		// Kill the clue jingle — round's over, verdict takes the stage
		this.sound.stopByKey(CJ.SFX.CLUE.key);
		this.timer.remove();
		this.timerBar.destroy();
		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;
		this.inputField.destroy(); // unhooks its own listeners
		this.submitBtn.destroy();


		// In/correct //
		this.add.uiLabel({
			x: cx,
			y: cy + CJ.SPACING.XS,
			text: verdict,
			style: { ...CJ.TYPE_LEVELS.H4, textColor: verdictColor },
		});


		// Reveal the right "question" //
		this.add.uiLabel({
			x: cx,
			y: cy + CJ.SPACING.M,
			text: this.clue.question,
			style: {
				...CJ.TYPE_LEVELS.H4,
				textColor: CJ.PALETTE.LIME,
				fontStyle: 'bold',
				align: 'center',
				wordWrap: { width: 600 },
			},
		});


		// Continue button //
		this.add.uiButton({
			x: cx,
			y: cy + CJ.SPACING.XXL,
			width: 200,
			height: 50,
			text: 'Continue',
			sfx: {
				hover: CJ.SFX.HOVER.key,
				press: CJ.SFX.PRESS.key,
				click: CJ.SFX.SELECT.key,
			},
			style: {
				...CJ.TYPE_LEVELS.P_BIG,
				textColor: CJ.PALETTE.BLACK,
				backgroundColor: CJ.PALETTE.AMBER,
			},
			onClick: () => this.returnToBoard(),
		});
	}


	returnToBoard() {
		const score = this.score + this.pointsDelta;

		// Count every tile on the board — if all are visited, game over
		const totalClues = this.board.reduce(
			(sum, cat) => sum + cat.clues.length, 0
		);
		if (this.visitedClues.length >= totalClues) {
			this.scene.start(CJ.SCENES.GAMEOVER, { score });
			return;
		}

		this.scene.start(CJ.SCENES.BOARD, {
			score,
			visitedClues: this.visitedClues,
			board: this.board,
			layout: this.layout
		});
	}


	// Reduce a Jeopardy "question" (or the player's typed response) to
	// the part that matters: drops the "What/Who/When is/are" prefix,
	// accent marks, punctuation, articles, whitespace, and case — so
	// "Pokémon" matches "pokemon" and "What is Mario?" matches "mario".
	static normalizeResponse(str) {
		return str
			.toLowerCase()
			.normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accent marks
			.replace(/^(what|who|when)\s+(is|are)\s+/, '')
			.replace(/[^a-z0-9\s]/g, '')
			.split(/\s+/)
			.filter((w) => w && !['a', 'an', 'the'].includes(w))
			.join('');
	}

	//#endregion
}