// 2. The Main Jeopardy Board Scene
class GameBoard extends Phaser.Scene {
	constructor() {
		super({ key: 'GameBoard' });
	}

	init(data) {
		// Track score across scene switches
		this.score = data.score || 0;
		this.visitedClues = data.visitedClues || [];
	}

	create() {
		const r = this.scale.width;
		const b = this.scale.height;
		const cx = r / 2;
		const cy = b / 2;
		this.add.image(cx,cy,"room").setOrigin(.5).setScale(1.5)

		this.scoreText = this.add.text(
			r - 40,
			40,
			`SCORE: $${this.score}`,
			{
				fontFamily: 'Barlow-Condensed-700',
				fontSize: '24px',
				fill: '#00ff00'
			}
		).setOrigin(1,0);

		const colWidth = 200;
		const rowHeight = 80;
		const startX = 150;
		const startY = 120;

		GAME_DATA.forEach((catData, colIdx) => {
			// Render Category Header
			this.add.text(
				startX + (colIdx * colWidth),
				startY,
				catData.category,
				{
					fontFamily: 'Barlow-Condensed-400',
					fontSize: '20px',
					fill: '#ffff00',
					align: 'center',
					wordWrap: { width: colWidth - 20 }
				}
			).setOrigin(0.5);

			// Render Point Tiles
			catData.clues.forEach((clue, rowIdx) => {
				const x = startX + (colIdx * colWidth);
				const y = startY + ((rowIdx + 1) * rowHeight);
				const clueId = `${colIdx}-${rowIdx}`;

				// Check if this clue was already picked
				const isVisited = this.visitedClues.includes(clueId);

				// Draw Tile Background
				const tileBg = this.add.rectangle(
					x,
					y,
					colWidth - 10,
					rowHeight - 10,
					isVisited ? 0x333333 : 0x1155ff
				)
				// .setStrokeStyle(2, 0xffffff);

				// Draw Text Value
				const tileText = this.add.text(
					x,
					y,
					isVisited ? "" : `$${clue.points}`,
					{
						fontSize: '30px',
						fill: '#fffb00ff',
						fontFamily: 'Barlow-Condensed-600',
					}
				).setOrigin(0.5);

				if (!isVisited) {
					// Make Interactive
					tileBg.setInteractive({ useHandCursor: true });
					tileBg.on('pointerover', () => tileBg.setFillStyle(0x0000ff));
					tileBg.on('pointerout', () => tileBg.setFillStyle(0x0000af));
					tileBg.on('pointerdown', () => {
						this.visitedClues.push(clueId);
						// Launch the Clue overlay scene
						this.scene.start('Clue', {
							clue: clue,
							score: this.score,
							visitedClues: this.visitedClues
						});
					});
				}
			});
		});
	}
}

