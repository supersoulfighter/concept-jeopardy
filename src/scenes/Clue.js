// 3. The Active Clue Overlay Scene
class Clue extends Phaser.Scene {
	constructor() {
		super({key: CJ.SCENES.CLUE});
	}

	create(data) {
		this.clue = data.clue;
		this.score = data.score;
		this.visitedClues = data.visitedClues;

		const L = CJ.LAYOUT.CLUE;
		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;

		// Big blue background for the clue
		this.add.rectangle(cx, cy, L.PANEL_W, L.PANEL_H, CJ.COLORS.CLUE_BG);

		// Display Clue Prompt
		this.promptText = this.add.text(
			cx,
			cy + L.PROMPT_DY,
			this.clue.question,
			{
				fontSize: L.PROMPT_SIZE,
				fill: CJ.TEXT.CLUE,
				align: 'center',
				wordWrap: {width: L.TEXT_WRAP}
			}
		).setOrigin(0.5);

		// Interactive "Reveal Answer" Button
		const revealBtn = this.add.rectangle(
			cx,
			cy + L.REVEAL_DY,
			L.REVEAL_W,
			L.BTN_H,
			CJ.COLORS.BTN_REVEAL
		).setInteractive({useHandCursor: true});

		const revealText = this.add.text(
			cx,
			cy + L.REVEAL_DY,
			'Reveal Answer',
			{
				fontSize: L.BTN_SIZE,
				fill: CJ.TEXT.BTN_DARK
			}
		).setOrigin(0.5);

		revealBtn.on('pointerdown', () => {
			revealBtn.destroy();
			revealText.destroy();
			this.showAnswerControls();
		});
	}

	showAnswerControls() {
		const L = CJ.LAYOUT.CLUE;
		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;

		// Show correct answer text
		this.add.text(cx, cy + L.ANSWER_DY, this.clue.answer, {
			fontSize: L.ANSWER_SIZE,
			fill: CJ.TEXT.ANSWER,
			fontStyle: 'bold',
			align: 'center',
			wordWrap: {width: L.TEXT_WRAP}
		}).setOrigin(0.5);

		// Correct Button (+ Points)
		const correctBtn = this.add.rectangle(
			cx - L.BTN_DX,
			cy + L.BTN_ROW_DY,
			L.BTN_W, L.BTN_H,
			CJ.COLORS.BTN_CORRECT
		).setInteractive({useHandCursor: true});

		this.add.text(
			cx - L.BTN_DX,
			cy + L.BTN_ROW_DY,
			'Correct',
			{
				fontSize: L.BTN_SIZE,
				fill: CJ.TEXT.BTN_LIGHT
			}
		).setOrigin(0.5);
		correctBtn.on('pointerdown', () => this.returnToBoard(this.clue.points));

		// Incorrect Button (- Points)
		const wrongBtn = this.add.rectangle(
			cx + L.BTN_DX,
			cy + L.BTN_ROW_DY,
			L.BTN_W,
			L.BTN_H,
			CJ.COLORS.BTN_WRONG
		).setInteractive({useHandCursor: true});

		this.add.text(
			cx + L.BTN_DX,
			cy + L.BTN_ROW_DY,
			'Incorrect',
			{
				fontSize: L.BTN_SIZE,
				fill: CJ.TEXT.BTN_LIGHT
			}
		).setOrigin(0.5);
		wrongBtn.on('pointerdown', () => this.returnToBoard(-this.clue.points));
	}

	returnToBoard(pointsModifier) {
		this.scene.start(CJ.SCENES.BOARD, {
			score: this.score + pointsModifier,
			visitedClues: this.visitedClues
		});
	}
}

