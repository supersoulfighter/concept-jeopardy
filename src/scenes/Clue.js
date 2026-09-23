// 3. The Active Clue Overlay Scene
class Clue extends Phaser.Scene {
	constructor() {
		super({ key: 'Clue' });
	}

	create(data) {
		this.clue = data.clue;
		this.score = data.score;
		this.visitedClues = data.visitedClues;

		// Big blue background for the clue
		this.add.rectangle(400, 300, 800, 600, 0x0000af);

		// Display Clue Prompt
		this.promptText = this.add.text(400, 200, this.clue.question, {
			fontSize: '28px', fill: '#ffffff', align: 'center', wordWrap: { width: 600 }
		}).setOrigin(0.5);

		// Interactive "Reveal Answer" Button
		const revealBtn = this.add.rectangle(400, 400, 250, 50, 0xffcc00).setInteractive({ useHandCursor: true });
		const revealText = this.add.text(400, 400, 'Reveal Answer', { fontSize: '20px', fill: '#000' }).setOrigin(0.5);

		revealBtn.on('pointerdown', () => {
			revealBtn.destroy();
			revealText.destroy();
			this.showAnswerControls();
		});
	}

	showAnswerControls() {
		// Show correct answer text
		this.add.text(400, 320, this.clue.answer, {
			fontSize: '26px', fill: '#00ff00', fontStyle: 'bold', align: 'center', wordWrap: { width: 600 }
		}).setOrigin(0.5);

		// Correct Button (+ Points)
		const correctBtn = this.add.rectangle(280, 450, 160, 50, 0x00aa00).setInteractive({ useHandCursor: true });
		this.add.text(280, 450, 'Correct', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
		correctBtn.on('pointerdown', () => this.returnToBoard(this.clue.points));

		// Incorrect Button (- Points)
		const wrongBtn = this.add.rectangle(520, 450, 160, 50, 0xaa0000).setInteractive({ useHandCursor: true });
		this.add.text(520, 450, 'Incorrect', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
		wrongBtn.on('pointerdown', () => this.returnToBoard(-this.clue.points));
	}

	returnToBoard(pointsModifier) {
		this.scene.start('GameBoard', {
			score: this.score + pointsModifier,
			visitedClues: this.visitedClues
		});
	}
}

